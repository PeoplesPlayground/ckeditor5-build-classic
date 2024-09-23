import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export class CustomPlugin extends Plugin {

    init() {
		const editor = this.editor;
        const editorShadow = document.getElementsByClassName('ckeditor-image-shadow')[0];
        let interval;

        const insertImg = (data, position) => {
			// Insert the image in the current selection location.
			const imageUtils = editor.plugins.get( 'ImageUtils' );
			const ret = imageUtils.insertImage({
				src: data.img.url,
				class: `direct-html__${data.type}`
			}, position );

			console.log('insertContent', ret);
        };

        const intervalFunction = (position) => {
            if (editorShadow.innerHTML === '"stop"') {
                clearInterval(interval);
            } else if (editorShadow.innerHTML !== '"start"') {
                clearInterval(interval);
                insertImg(JSON.parse(editorShadow.innerHTML), position);
            }
        };

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
