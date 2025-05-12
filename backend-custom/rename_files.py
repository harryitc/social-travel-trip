import os


def rename_files_by_name(folder_path, target_substring, replacement_substring):
    # Iterate through files in the folder
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if target_substring in file:
                old_file_path = os.path.join(root, file)
                new_file_name = file.replace(
                    target_substring, replacement_substring)
                new_file_path = os.path.join(root, new_file_name)
                try:
                    os.rename(old_file_path, new_file_path)
                    print(f"Renamed: {old_file_path} -> {new_file_path}")
                except Exception as e:
                    print(f"Error renaming {old_file_path}: {e}")


folder = "./src/modules/m_20250402_crm"
target_substring = "corerm"
replacement_substring = "corerm"
rename_files_by_name(folder, target_substring, replacement_substring)
