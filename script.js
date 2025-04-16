const htmlTag = document.documentElement;
const sunIcon = document.getElementById ('sun-icon');
const moonIcon = document.getElementById ('moon-icon');
const changeTheme = document.getElementById ('change-theme');
const lightTheme = 'fantasy';
const darkTheme = 'abyss';
const themeChanger = () => {
  const currentTheme = htmlTag.getAttribute ('data-theme');
  if (currentTheme === darkTheme) {
    sunIcon.classList.add ('hidden');
    moonIcon.classList.remove ('hidden');
    htmlTag.setAttribute ('data-theme', lightTheme);
  } else {
    sunIcon.classList.remove ('hidden');
    moonIcon.classList.add ('hidden');
    htmlTag.setAttribute ('data-theme', darkTheme);
  }
};
themeChanger ();

//  Attaching event listener
changeTheme.addEventListener ('click', themeChanger);

///////////////////////////////////////////////////////////////////////

// image-input
const imageInput = document.getElementById ('image-input');
const previewImg = document.getElementById ('preview-image');

const displayImg = () => {
  const file = imageInput.files[0];
  previewImg.classList.remove ('hidden');

  if (file) {
    const reader = new FileReader ();
    reader.onload = e => {
      previewImg.src = e.target.result;
    };
    reader.readAsDataURL (file);
  }
};

imageInput.addEventListener ('change', displayImg);
///////////////////////////////////////////////////////////////////////
//reset function
const displayBlock = document.getElementById ('display-block');
const resetBtn = document.getElementById ('reset-btn');

const reset = () => {
  previewImg.classList.add ('hidden');
  imageInput.value = '';
  displayBlock.classList.add ('hidden');
  contentBox.value = '';
};

resetBtn.addEventListener ('click', reset);

////////////////////////////////
//display copy msg

const copyMsg = document.getElementById ('copy-msg');
const copyBtn = document.getElementById ('copy-btn');
const contentBox = document.getElementById ('content-box');
const copyContents = () => {
  const content = contentBox.value;
  copyMsg.classList.remove ('hidden');
  navigator.clipboard
    .writeText (content)
    .then (() => {
      setTimeout (() => {
        copyMsg.classList.add ('hidden');
      }, 1000);
    })
    .catch (err => {
      console.error ('Failed to copy: ', err);
    });
};
copyBtn.addEventListener ('click', copyContents);

////////////////////////////
//image to text

const afterProcess = text => {
  if (text.length) {
    displayBlock.classList.remove ('hidden');
    contentBox.value = text;
  } else {
    alert ('Sorry! Something went wrong!');
  }
};

const extractTextFromImage = async image => {
  try {
    progressBarContainer.classList.remove ('hidden');
    const result = await Tesseract.recognize (image, 'eng+ben', {
      logger: m => {
        progressBar.setAttribute ('value', 0);
        if (m.status === 'recognizing text') {
          const progress = Math.floor (m.progress * 100);
          progressBar.setAttribute ('value', progress);
        }
      },
    });
    progressBarContainer.classList.add ('hidden');
    return result.data.text;
  } catch (error) {
    progressBarContainer.classList.add ('hidden');

    console.error ('OCR Error:', error);
    throw 'Failed to extract text';
  }
};

let isProcessing = false;

const handleImage = () => {
  if (isProcessing) return;
  isProcessing = true;

  processBtn.classList.add ('hidden');
  loadingBtn.classList.remove ('hidden');
  displayBlock.classList.add ('hidden');

  const input = imageInput;
  if (!input.files.length) {
    alert ('No image selected!');
    processBtn.classList.remove ('hidden');
    loadingBtn.classList.add ('hidden');
    isProcessing = false;
    return;
  }

  const file = input.files[0];
  const reader = new FileReader ();

  reader.onload = async () => {
    try {
      const imageUrl = reader.result;
      const text = await extractTextFromImage (imageUrl);
      console.log ('Extracted:', text);
      console.log ('Length:', text.trim ().length);

      if (text && text.trim ().length > 0) {
        console.log (`inside=${text}`);
        afterProcess (text);
      } else {
        afterProcess ('⚠️ No readable text found in the image.');
      }
    } catch (err) {
      console.error ('OCR Error:', err);
      afterProcess ('❌ Failed to extract text.');
    } finally {
      processBtn.classList.remove ('hidden');
      loadingBtn.classList.add ('hidden');
      isProcessing = false;
    }
  };

  reader.readAsDataURL (file);
};
const processBtn = document.getElementById ('process-btn');
const loadingBtn = document.getElementById ('loading-btn');
const progressBarContainer = document.getElementById ('progress-bar-container');
const progressBar = document.getElementById ('progress-bar');
processBtn.addEventListener ('click', handleImage);
