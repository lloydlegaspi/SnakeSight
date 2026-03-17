import tensorflow as tf
from tensorflow.keras.layers import Layer, Dense, Reshape, Add, Activation, Multiply, Conv2D, Concatenate
from tensorflow.keras.regularizers import l2
from tensorflow.keras.layers import GlobalAveragePooling2D, GlobalMaxPooling2D
from keras.saving import register_keras_serializable

@register_keras_serializable()
class GlobalMeanPoolChannel(Layer):
    def __init__(self, **kwargs):
        super(GlobalMeanPoolChannel, self).__init__(**kwargs)

    def call(self, inputs):
        # Mean pool across channels
        return tf.reduce_mean(inputs, axis=-1, keepdims=True)

    def compute_output_shape(self, input_shape):
        return (input_shape[0], input_shape[1], input_shape[2], 1)

@register_keras_serializable()
class GlobalMaxPoolChannel(Layer):
    def __init__(self, **kwargs):
        super(GlobalMaxPoolChannel, self).__init__(**kwargs)

    def call(self, inputs):
        return tf.reduce_max(inputs, axis=-1, keepdims=True)

    def compute_output_shape(self, input_shape):
        return (input_shape[0], input_shape[1], input_shape[2], 1)

# Optional: register the functional modules too
@register_keras_serializable()
def channel_attention(input_feature, ratio=16, name_prefix="ch_att"):
    channel = input_feature.shape[-1]

    if channel <= 64:
        ratio = max(2, ratio // 2)

    shared_layer_one = Dense(
        channel // ratio,
        activation='relu',
        kernel_initializer='he_normal',
        kernel_regularizer=l2(1e-4),
        use_bias=True,
        bias_initializer='zeros',
        name=f"{name_prefix}_dense_reduce"
    )

    shared_layer_two = Dense(
        channel,
        kernel_initializer='he_normal',
        kernel_regularizer=l2(1e-4),
        use_bias=True,
        bias_initializer='zeros',
        name=f"{name_prefix}_dense_expand"
    )

    avg_pool = GlobalAveragePooling2D(name=f"{name_prefix}_gap")(input_feature)
    avg_pool = Reshape((1, 1, channel), name=f"{name_prefix}_reshape_avg")(avg_pool)
    avg_pool = shared_layer_one(avg_pool)
    avg_pool = shared_layer_two(avg_pool)

    max_pool = GlobalMaxPooling2D(name=f"{name_prefix}_gmp")(input_feature)
    max_pool = Reshape((1, 1, channel), name=f"{name_prefix}_reshape_max")(max_pool)
    max_pool = shared_layer_one(max_pool)
    max_pool = shared_layer_two(max_pool)

    cbam_feature = Add(name=f"{name_prefix}_add")([avg_pool, max_pool])
    cbam_feature = Activation('sigmoid', name=f"{name_prefix}_sigmoid")(cbam_feature)

    return Multiply(name=f"{name_prefix}_multiply")([input_feature, cbam_feature])

@register_keras_serializable()
def spatial_attention(input_feature, name_prefix="sp_att"):
    kernel_size = 7

    avg_pool = GlobalMeanPoolChannel(name=f"{name_prefix}_mean_pool")(input_feature)
    max_pool = GlobalMaxPoolChannel(name=f"{name_prefix}_max_pool")(input_feature)

    concat = Concatenate(name=f"{name_prefix}_concat")([avg_pool, max_pool])

    spatial_map = Conv2D(
        filters=1,
        kernel_size=kernel_size,
        padding='same',
        activation='sigmoid',
        kernel_initializer='he_normal',
        kernel_regularizer=l2(1e-4),
        use_bias=False,
        name=f"{name_prefix}_conv"
    )(concat)

    return Multiply(name=f"{name_prefix}_multiply")([input_feature, spatial_map])

@register_keras_serializable()
def cbam_block(input_feature, name_prefix="cbam", use_residual=True):
    channel_refined = channel_attention(input_feature, name_prefix=f"{name_prefix}_ch")
    spatial_refined = spatial_attention(channel_refined, name_prefix=f"{name_prefix}_sp")

    if use_residual:
        output = Add(name=f"{name_prefix}_residual")([input_feature, spatial_refined])
        return output
    else:
        return spatial_refined
