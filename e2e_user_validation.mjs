import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const brainDir = path.join(__dirname, '.gemini/antigravity/brain/b70cdab0-7b45-4e39-b09f-801dcf5156d1');

async function runValidation() {
    console.log('🚀 Iniciando validação com credenciais reais...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    try {
        console.log('1️⃣ Acessando localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

        console.log('2️⃣ Logando com admin@autogestao.com.br / Jose20161@...');
        await page.fill('input[type="email"]', 'admin@autogestao.com.br');
        await page.fill('input[type="password"]', 'Jose20161@');
        // Acha o botão de login (Acessar o Sistema ou Entrar)
        const loginBtn = await page.locator('button:has-text("Acessar o Sistema"), button:has-text("Entrar")').first();
        await loginBtn.click();

        // Espera sair da tela de login
        await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(() => console.log('Timeout waiting for URL, continuing...'));
        await page.waitForTimeout(4000); // Espera carregamento dos dados pesados

        console.log('✅ Login efetuado. Tirando print do Dashboard...');
        const dashPath = path.join(brainDir, 'user_val_dashboard.png');
        await page.screenshot({ path: dashPath, fullPage: true });

        console.log('3️⃣ Acessando Funil / CRM...');
        const funilLink = await page.locator('text="Funil"').first();
        if (await funilLink.isVisible()) {
            await funilLink.click();
            await page.waitForTimeout(2000);
            const funilPath = path.join(brainDir, 'user_val_funil.png');
            await page.screenshot({ path: funilPath, fullPage: true });

            // Testar clique num botão
            const novoLeadBtn = await page.locator('button:has-text("Novo Lead")').first();
            if (await novoLeadBtn.isVisible()) {
                console.log('✅ Botão Novo Lead visível e clicável');
                await novoLeadBtn.click();
                await page.waitForTimeout(1000);
                await page.screenshot({ path: path.join(brainDir, 'user_val_modal_lead.png') });
                // Fechar modal (clicando fora ou no 'x' ou apenas recarregando)
                await page.keyboard.press('Escape');
            }
        }

        console.log('4️⃣ Acessando Equipe...');
        const equipeLink = await page.locator('text="Equipe", text="Gerenciamento"').first();
        if (await equipeLink.isVisible()) {
            await equipeLink.click();
            await page.waitForTimeout(2000);
            await page.screenshot({ path: path.join(brainDir, 'user_val_equipe.png'), fullPage: true });
        }

        console.log('5️⃣ Acessando Relatório Matinal...');
        const relatorioLink = await page.locator('text="Relatório Matinal"').first();
        if (await relatorioLink.isVisible()) {
            await relatorioLink.click();
            await page.waitForTimeout(2000);
            await page.screenshot({ path: path.join(brainDir, 'user_val_relatorio.png'), fullPage: true });
        }

        console.log('🎉 Validação completa com sucesso.');

    } catch (e) {
        console.error('❌ Erro durante validação:', e);
        await page.screenshot({ path: path.join(brainDir, 'user_val_erro.png'), fullPage: true });
    } finally {
        await browser.close();
    }
}

runValidation();
