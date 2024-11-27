// Select the iframe element for live preview
const preview = document.getElementById('preview');

// Initialize CodeMirror editors with default theme 'default'
const htmlEditor = CodeMirror(document.getElementById('html-code-editor'), {
    mode: 'htmlmixed',
    theme: 'default',
    lineNumbers: true,
    autoCloseTags: true,
    extraKeys: { 
      "Ctrl-Space": "autocomplete", 
      "Ctrl-Z": "undo", 
      "Ctrl-Y": "redo" 
    },
});
  
const cssEditor = CodeMirror(document.getElementById('css-code-editor'), {
    mode: 'css',
    theme: 'default',
    lineNumbers: true,
    autoCloseBrackets: true,
    extraKeys: { 
      "Ctrl-Space": "autocomplete", 
      "Ctrl-Z": "undo", 
      "Ctrl-Y": "redo" 
    },
    hintOptions: { 
      completeSingle: false 
    }
});
  
const jsEditor = CodeMirror(document.getElementById('js-code-editor'), {
    mode: 'javascript',
    theme: 'default',
    lineNumbers: true,
    autoCloseBrackets: true,
    extraKeys: { 
      "Ctrl-Space": "autocomplete", 
      "Ctrl-Z": "undo", 
      "Ctrl-Y": "redo" 
    },
    hintOptions: { 
      completeSingle: false 
    }
});

// Update live preview
function updatePreview() {
    const html = htmlEditor.getValue();
    const css = `<style>${cssEditor.getValue()}</style>`;
    const js = `<script>${jsEditor.getValue()}<\/script>`;
    const iframeContent = `${html}${css}${js}`;
  
    const previewDocument = preview.contentDocument || preview.contentWindow.document;
    previewDocument.open();
    previewDocument.write(iframeContent);
    previewDocument.close();
}

// Event listeners for live preview
htmlEditor.on('change', updatePreview);
cssEditor.on('change', updatePreview);
jsEditor.on('change', updatePreview);

// Save code to localStorage
const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
    const codeData = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue(),
    };
    localStorage.setItem('codeEditorData', JSON.stringify(codeData));
    alert('Code saved successfully!');
});

// Load code from localStorage
const loadBtn = document.getElementById('load-btn');
loadBtn.addEventListener('click', () => {
    const savedData = localStorage.getItem('codeEditorData');
    if (savedData) {
        const { html, css, js } = JSON.parse(savedData);
        htmlEditor.setValue(html);
        cssEditor.setValue(css);
        jsEditor.setValue(js);
        updatePreview();
        alert('Code loaded successfully!');
    } else {
        alert('No saved code found!');
    }
});

// Toggle theme (Light, Dark, Solarized)
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
    const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    
    // Apply the new theme to the body
    document.body.classList.remove(currentTheme);
    document.body.classList.add(newTheme);

    // Set the new theme to all editors
    htmlEditor.setOption('theme', newTheme === 'dark-theme' ? 'monokai' : 'default');
    cssEditor.setOption('theme', newTheme === 'dark-theme' ? 'monokai' : 'default');
    jsEditor.setOption('theme', newTheme === 'dark-theme' ? 'monokai' : 'default');
});

// Download files
const downloadBtn = document.getElementById('download-btn');
downloadBtn.addEventListener('click', () => {
    const zip = new JSZip();
    zip.file('index.html', htmlEditor.getValue());
    zip.file('styles.css', cssEditor.getValue());
    zip.file('script.js', jsEditor.getValue());

    zip.generateAsync({ type: 'blob' }).then((content) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'project.zip';
        link.click();
        URL.revokeObjectURL(link.href);
        alert('Project downloaded as ZIP!');
    });
});

// Undo/Redo functionality for all editors
const undoBtn = document.getElementById('undo-btn');
undoBtn.addEventListener('click', () => {
    htmlEditor.undo();
    cssEditor.undo();
    jsEditor.undo();
});

const redoBtn = document.getElementById('redo-btn');
redoBtn.addEventListener('click', () => {
    htmlEditor.redo();
    cssEditor.redo();
    jsEditor.redo();
});

// Initialize with default content
htmlEditor.setValue("<h1>Hello, World!</h1>");
cssEditor.setValue("h1 { color: blue; }");
jsEditor.setValue("console.log('Hello, World!');");
updatePreview();
