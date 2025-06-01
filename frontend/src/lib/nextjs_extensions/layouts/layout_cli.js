const fs = require('fs');
const path = require('path');
const { Log } = require('../clis/log.tool');

// Todo: Build file src/layouts/index.tsx from folder src/layouts like current file
const buildLayouts = () => {
    Log.green("○ Build layouts ...")
    const layoutsDir = path.join(__dirname, '../../../layouts');
    const indexPath = path.join(layoutsDir, 'index.tsx');

    // Ensure the layouts directory exists
    if (!fs.existsSync(layoutsDir)) {
        Log.error(`Error: Layouts directory not found at ${layoutsDir}`);
        return;
    }

    // Get all files in the layouts directory, excluding index.tsx and any non-TSX files
    const layoutFiles = fs
        .readdirSync(layoutsDir)
        .filter(
            (file) =>
                file !== 'index.tsx' &&
                file.endsWith('.tsx') &&
                !file.endsWith('.d.tsx') // Exclude declaration files
        );

    // Build the imports and the Layouts object
    let imports = '';
    let layoutObject = '';
    let defaultLayout = null;
    let layoutTypes = [];

    layoutFiles.forEach((file) => {
        const layoutName = path.basename(file, '.tsx');
        const componentName = layoutName
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
        imports += `import ${componentName} from "./${layoutName}";\n`;
        layoutObject += `    "${layoutName}": ${componentName},\n`;
        layoutTypes.push(`"${layoutName}"`);
        //Check default
        if (layoutName === "default") {
            defaultLayout = `"default"`
        }
    });
    // Create defaultLayout
    defaultLayout = defaultLayout ?? layoutTypes[0];

    // Build the index.tsx content
    const fileContent = `
${imports}

//Layout Type
type LayoutType = ${layoutTypes.join(' | ')}
//Default layout
const DefaultLayout: LayoutType = ${defaultLayout}
// All layouts
const Layouts: { [key: string]: any } = {
${layoutObject}
}
//Export
export { Layouts, DefaultLayout }
export type { LayoutType }
`;

    // Write the content to index.tsx
    try {
        fs.writeFileSync(indexPath, fileContent);
        Log.magenta(`- Successfully built layouts index file at src/layouts/index.tsx`);
        Log.green("✓ Build layouts done!")
    } catch (err) {
        Log.error(`⨯ Error writing layouts index file: ${err}`);
        Log.error("⨯ Build layouts STOP!")
    }
};

//Execute
buildLayouts();
