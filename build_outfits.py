import os
import json

VIDEOS_DIR = 'public/VIDEOS_OUTFITS'
OUTPUT_FILE = 'app/outfits/outfitsData.json'

def format_title(folder_name):
    # Convert "saco_theo" to "Saco Theo"
    words = folder_name.replace('_', ' ').split()
    return ' '.join(word.capitalize() for word in words)

def build_outfits():
    if not os.path.exists(VIDEOS_DIR):
        print(f"Error: Directory {VIDEOS_DIR} does not exist.")
        return

    outfits_data = []
    
    # Iterate through all items in the directory
    for folder_name in sorted(os.listdir(VIDEOS_DIR)):
        folder_path = os.path.join(VIDEOS_DIR, folder_name)
        
        # Only process directories
        if not os.path.isdir(folder_path):
            continue
            
        content_path = os.path.join(folder_path, 'content.txt')
        
        # Skip if no content.txt
        if not os.path.isfile(content_path):
            continue
            
        with open(content_path, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f.readlines() if line.strip()]
            
        if not lines:
            continue
            
        # Check if first line is ACTIVE
        if lines[0].upper() != 'ACTIVE':
            continue
            
        products = lines[1:]  # Remaining lines are products
        
        # Find video file in the folder (.mp4 or .webm)
        video_filename = None
        for file in os.listdir(folder_path):
            if file.lower().endswith(('.mp4', '.webm')):
                video_filename = file
                break
                
        if not video_filename:
            print(f"Warning: No video file found in {folder_name}. Skipping.")
            continue
            
        outfits_data.append({
            'id': f"outfit-{folder_name}",
            'title': format_title(folder_name),
            'video': f"/VIDEOS_OUTFITS/{folder_name}/{video_filename}",
            'products': products
        })

    # Write the JSON file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(outfits_data, f, indent=4)
        
    print(f"Successfully generated {OUTPUT_FILE} with {len(outfits_data)} active outfits.")

if __name__ == "__main__":
    build_outfits()
