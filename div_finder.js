const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function bfs(page) {
  const divElements = await page.$$('div');
  return divElements.length;
}

async function dfs(element, visited) {
    if (!element) {
        return 0;
    }
  
    let totalDivs = 0;
  
    if (!visited.has(element)) {
      visited.add(element);
      const children = await element.$x('.//*');
  
      if (children.length === 0) {
        return 1; 
      }
  
      for (const child of children) {
        const childElement = await child.asElement();
  
        
        if (!visited.has(childElement)) {
          visited.add(childElement);
          totalDivs += await dfs(childElement, visited);
        }
      }
    }
  
    return totalDivs;
  }
  
  

async function main() {
  try {
    const url = 'https://yazilim.mu.edu.tr/';
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url);

    // BFS
    const startBFS = Date.now();
    const totalDivsBFS = await bfs(page);
    const bfsTime = (Date.now() - startBFS) / 1000;

    // DFS
    const visited = new Set();
    const startDFS = Date.now();
    await dfs(await page.$('html'), visited);
    const dfsTime = (Date.now() - startDFS) / 1000;

    // Dosyaya yazma işlemi
    const outputFile = 'output.txt';
    await fs.writeFile(outputFile, '');
    await fs.appendFile(outputFile, `Total div elements: ${totalDivsBFS}\n`);
    await fs.appendFile(outputFile, `BFS Time: ${bfsTime} seconds\n`);
    await fs.appendFile(outputFile, `DFS Time: ${dfsTime} seconds\n`);

    
    await browser.close();

    console.log(`Çıktılar "${outputFile}" adlı dosyaya yazıldı.`);
  } catch (error) {
    console.error('Bir hata oluştu:', error);
  }
}

main()

/*puppeteer kütüphanesini kullanarak ,mskü yazılım mühendisliğinin sayfasına sırasıyla bfs ve dfs uygulayarak
toplamda kaç adet div olduğunu ve bunları bulma süresini output.txt adlı dosyaya yazan bir js
programı.*/

//210717021 Samet Koca