import Api from './Api'

const saveTransactionsFromFile = (file: File): void => {
  const formData = new FormData();
  formData.append("file", file);
  fetch(Api.url + 'uploadfile', {
    method: 'POST',
    body: formData
  })
    .then((response) => {
      return response
    })
    .catch((err) => console.log(err))
}

const FileUploadService = {
  saveTransactionsFromFile
};

export default FileUploadService;
