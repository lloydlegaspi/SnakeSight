# Philippine Snake Classification System

The Philippine Snake Classification System is an AI-powered tool designed primarily for medical applications. It helps to identify snake species from images, particularly to determine if a snake is venomous or non-venomous.

This system is focused specifically on Philippine snake species, with a limited scope of fourteen terrestrial species: six medically important venomous species as classified by the World Health Organization, and eight non-venomous look-alikes that are often confused with their venomous counterparts.

## How to Run

1. Clone the repository
```bash
git clone https://github.com/AkzechKyla/ph_snake_classifier.git
```

2. Configure Backend Environment
```bash
cd backend
cp .env.example .env
```

3. Configure Frontend Environment
```bash
cd backend
cp .env.local.example .env
```

4. Add your **.keras** model inside **backend/model/**
> Modify model paths in your `.env` file if different model names are used.

5. Add **metadata.json** inside **backend/model/**
> Copy and paste metadata from this link: https://pastebin.com/dh2aX73g

6. Upload annotations **txt** files inside **backend/annotations**
> Download annotations from this link: https://mega.nz/folder/vpVQSQKT#DhUd-ydREMKxK8UdbCHT7Q

7. Install and run backend server
```bash
cd backend
pip install -r requirements.txt
python main.py
```

8. Install and run frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Note: For **Test Mode**, strictly use images from this dataset only.
> https://github.com/lloydlegaspi/ph_snake_classifier/tree/main/Dataset/AnnotatedSnakeDataset/images
