import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export class CustomPlugin extends Plugin {

    init() {
        const editorShadow = document.getElementsByClassName('ckeditor-image-shadow')[0];
        let interval;

        const setImgClass = (url, type) => {
            const img = [...document.getElementsByTagName('img')].filter(img => img.src === url)[0];
            img.classList.add(`direct-html__${type}`);
        }

        const insertImg = (data, position) => {
            this.editor.model.change(writer => {
                const imageElement = writer.createElement('image', {
                    src: data.img.url,
                });

                const ourSelection = writer.createSelection(position);

                // Insert the image in the current selection location.
                this.editor.model.insertContent(imageElement, ourSelection);

                setTimeout(() => setImgClass(data.img.url, data.type), 300);
            });
        };

        const intervalFunction = (position) => {
            if (editorShadow.innerHTML === '"stop"') {
                clearInterval(interval);
            } else if (editorShadow.innerHTML !== '"start"') {
                clearInterval(interval);
                insertImg(JSON.parse(editorShadow.innerHTML), position);
            }
        }

        const editor = this.editor;

        editor.ui.componentFactory.add('insertImage', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Insert image',
                icon: imageIcon,
                tooltip: true
            });

            // Callback executed once the image is clicked.
            view.on('execute', () => {
                const position = editor.model.document.selection.getFirstRange();
                editorShadow.click();
                interval = setInterval(() => intervalFunction(position), 100);
            });

            return view;
        });
    }
}