import time

from selenium import webdriver
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())


codes = []
titles = []
submissions = []
difficulty = []
urls = []

startUrl = "https://www.codechef.com/practice?page="
endUrl = "&limit=50&sort_by=difficulty_rating&sort_order=asc&search=&start_rating=0&end_rating=5000&topic=&tags=&group=all"

for x in range(0,73):
    baseurl=startUrl+str(x)+endUrl
    driver.get(baseurl)
    time.sleep(5)
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    body= soup.find("tbody", {"class" : "MuiTableBody-root"})
    rows= body.findAll("tr", {"class" : "MuiTableRow-root"})
    for row in rows:
      codes.append(row.contents[0].contents[1].text)
      titles.append(row.contents[1].contents[1].contents[0].text)
      submissions.append(row.contents[2].contents[1].text)
      difficulty.append(row.contents[3].contents[1].text)
      urls.append(row.contents[5].contents[1].contents[0].attrs['href'])


with open("problem_codes.txt", "w+") as f:
    f.write('\n'.join(codes))
with open("problem_titles.txt", "w+") as f:
    f.write('\n'.join(titles))
with open("problem_submissions.txt", "w+") as f:
    f.write('\n'.join(submissions))
with open("problem_difficulty.txt", "w+") as f:
    f.write('\n'.join(difficulty))
with open("problem_urls.txt", "w+") as f:
    f.write('\n'.join(urls))


with open("temp_urls.txt",'r') as f:
    cnt = 1
    for line in f:
        driver.get(line)
        time.sleep(5)
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        problem_text = soup.find('div', {"id": "problem-statement"})
        remainder_text1 = problem_text.select("#problem-statement > h2")
        for elem in remainder_text1:
            elem.decompose()
        remainder_text2 = problem_text.select("#problem-statement > h3:nth-child(2)")
        for elem in remainder_text2:
            elem.decompose()
        remainder_text = problem_text.select(selector="math")
        for elem in remainder_text:
            elem.decompose()
        problem_text = problem_text.getText()
        print(cnt);
        with open("ps/problem_text_" + str(cnt) + ".txt", "w+" , encoding="utf-8") as f:
            f.write(problem_text)
        cnt = cnt+1


