import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Patterns for Header/Footer from common
    header_import = r"import\s+Header\s+from\s+'@/components/common/header';"
    footer_import = r"import\s+Footer\s+from\s+'@/components/common/Footer';"
    
    # Remove imports
    content = re.sub(header_import, "", content)
    content = re.sub(footer_import, "", content)
    
    # Remove JSX instances
    content = re.sub(r"<\s*Header\s*/>", "", content)
    content = re.sub(r"<\s*Footer\s*/>", "", content)
    
    # Clean up empty lines created by removals
    content = re.sub(r"\n\s*\n\s*\n", "\n\n", content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    base_dir = r"d:\everacy\realstate\frontend\src"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith("page.tsx") or file == "Home.tsx":
                filepath = os.path.join(root, file)
                # Skip layout.tsx or MainWrapper itself
                if "layout.tsx" in filepath or "MainWrapper.tsx" in filepath:
                    continue
                
                # Read first part to see if it has the common imports
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    head = f.read(1000)
                
                if "@/components/common/header" in head or "@/components/common/Footer" in head:
                    print(f"Cleaning {filepath}")
                    clean_file(filepath)

if __name__ == "__main__":
    main()
