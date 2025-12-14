import os
import re
import json

directory = "Voices"
files = os.listdir(directory)

mapping = {}

for filename in files:
    if not filename.endswith(".wav") and not filename.endswith(".mp3"):
        continue
    
    # Pattern: OldName (NewName).ext
    match = re.match(r"^(.*?)\s*\((.*?)\).*\.(wav|mp3)$", filename)
    if match:
        old_name_raw = match.group(1).strip()
        new_name_raw = match.group(2).strip()
        ext = match.group(3)
        
        # Clean up old name for matching (lowercase)
        old_name_key = old_name_raw.lower()
        
        # Sanitize new name for filename? User wants "aarav", "Advocate Mehta".
        # Let's keep it as is but trim.
        new_filename = f"{new_name_raw}.{ext}"
        
        # Rename
        old_path = os.path.join(directory, filename)
        new_path = os.path.join(directory, new_filename)
        
        try:
            os.rename(old_path, new_path)
            print(f"Renamed: {filename} -> {new_filename}")
            
            if old_name_key not in mapping:
                mapping[old_name_key] = []
            mapping[old_name_key].append(new_name_raw)
            
        except Exception as e:
            print(f"Error renaming {filename}: {e}")
    else:
        print(f"Skipping: {filename}")

print("MAPPING_JSON_START")
print(json.dumps(mapping, indent=2))
print("MAPPING_JSON_END")
