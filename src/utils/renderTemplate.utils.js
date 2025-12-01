import fs from "node:fs/promises";
import path from "node:path";
import ejs from "ejs";

export async function renderTemplate(templateRelativePath, data = {}) {
	const filePath = path.join(process.cwd(), "templates", templateRelativePath);
	const src = await fs.readFile(filePath, "utf8");
	return ejs.render(src, data);
}
