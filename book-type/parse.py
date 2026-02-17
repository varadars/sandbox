import json


book_name = 'TheWayOfKings'
folder_path = './' + book_name
book_path = folder_path + '/book.txt'

texts = []
started = 0
with open(book_path, "r") as book:
    content = book.readlines()
    for line in content:
        s = line.strip()
        if("PRELUDE" in s or "PROLOGUE" in s):
            started = 1
        if started:
            if(s and not s.isupper()):
                texts.append(s)
            if(s == "ENDNOTE"):
                break

with open(folder_path + "/sentences.json", "w", encoding="utf-8") as f:
    json.dump(texts, f, ensure_ascii=False, indent=2)