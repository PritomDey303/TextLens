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
  displayBlock.classList.remove ('hidden');
  contentBox.textContent = text;
};

const extractTextFromImage = async image => {
  try {
    const result = await Tesseract.recognize (image, 'eng+ben', {
      logger: m => console.log (m),
    });
    return result.data.text;
  } catch (error) {
    console.error ('OCR Error:', error);
    throw 'Failed to extract text';
  }
};

const handleImage = () => {
  processBtn.classList.add ('hidden');
  loadingBtn.classList.remove ('hidden');
  const input = imageInput;
  if (!input.files.length) {
    processBtn.classList.remove ('hidden');
    loadingBtn.classList.add ('hidden');
    alert ('No image selected!');
    return;
  }

  const file = input.files[0];
  const reader = new FileReader ();

  reader.onload = async () => {
    try {
      const imageUrl = reader.result;
      const text = await extractTextFromImage (imageUrl);
      console.log (text);
      afterProcess (text);

      processBtn.classList.remove ('hidden');
      loadingBtn.classList.add ('hidden');
    } catch (err) {
      console.error (err);
      processBtn.classList.remove ('hidden');
      loadingBtn.classList.add ('hidden');
    }
  };

  reader.readAsDataURL (file);
};

const processBtn = document.getElementById ('process-btn');
const loadingBtn = document.getElementById ('loading-btn');

processBtn.addEventListener ('click', handleImage);
