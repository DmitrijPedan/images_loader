function foo () {};

export function upload (selector, options = {}) {

    let files = [];

    //upload
    const onUpload = options.onUpload ? options.onUpload : foo;

    //input
    const input = document.querySelector(selector);

    if(options.multiSelect) {
        input.setAttribute('multiple', 'multiple');
    }

    if (options.fileTypes && Array.isArray(options.fileTypes)) {
        input.setAttribute('accept', options.fileTypes.join(', '))
    }

    //thumbnails
    const thumbnails = document.createElement('div');
    thumbnails.classList.add('thumbnails');

    //add button
    const addButton = document.createElement('button');
    addButton.classList.add("btn");
    addButton.textContent = "Open";

    //upload button
    const uploadButton = document.createElement('button');
    uploadButton.id = 'uploadBtn';
    uploadButton.classList.add("btn");
    uploadButton.classList.add("accent-btn");
    uploadButton.textContent = "Upload";
    uploadButton.style.display = "none";

    //add elements
    input.insertAdjacentElement('afterend', thumbnails);
    input.insertAdjacentElement('afterend', uploadButton);
    input.insertAdjacentElement('afterend', addButton);


    const triggerInput = () => input.click();

    const changeHandler = (e) => {

        if (!e.target.files) {
            return;
        }


        files = Array.from(e.target.files);

        thumbnails.innerHTML = '';
        uploadButton.style.display = 'inline-block';

        files.forEach(file => {

            if(!file.type.match('image')) {
                return;
            }

            const reader = new FileReader();
            reader.onload = event => {
                const preview = createPreview(event.target.result, file.name, file.size);
                thumbnails.appendChild(preview)
                console.log(event)
            }
            reader.readAsDataURL(file);

        })

    };

    function createPreview (file, name, size) {

        const previewDiv = document.createElement('div');
        previewDiv.className = 'preview';
        previewDiv.style.backgroundImage = `url('${file}')`;

        const remSpan = document.createElement('span');
        remSpan.setAttribute('data-name', name);
        remSpan.className = 'rem';
        remSpan.innerHTML = '&times';
        previewDiv.appendChild(remSpan);

        const sizeSpan = document.createElement('span');
        const fileSize = size ? Math.ceil(Number(size) / 1000) : '';
        sizeSpan.className = 'size';
        sizeSpan.textContent = fileSize + ' Kb';
        previewDiv.appendChild(sizeSpan);

        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        nameSpan.textContent = name;
        previewDiv.appendChild(nameSpan);

        return previewDiv;
    }

    const removeHandler = (event) => {

        if (!event.target.dataset.name) {
            return;
        }

        const fileName = event.target.dataset.name;
        files = files.filter(file => file.name !== fileName);

        if (!files.length) {
            uploadButton.style.display = 'none';
        }

        const preview = thumbnails.querySelector(`[data-name="${fileName}"]`).closest('.preview');
        preview.classList.add('removed');
        preview.addEventListener('transitionend', () => preview.remove());

    }

    const uploadHandler = () => {
        thumbnails.querySelectorAll('.preview .rem').forEach(el => el.remove());
        const infoBlocks = thumbnails.querySelectorAll('.preview .name');
        infoBlocks.forEach(el => {
            el.innerHTML = '<div class="progress"></div>';
            el.style.transform = 'none';
            el.style.padding = '0';
        })
        onUpload(files, infoBlocks);
    }

    addButton.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    thumbnails.addEventListener('click', removeHandler);
    uploadButton.addEventListener('click', uploadHandler);
}