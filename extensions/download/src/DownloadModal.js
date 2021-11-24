import OHIF from '@ohif/core';
import React, { useState, useEffect } from 'react';
import _downloadAndZip from './downloadAndZip';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

function label(notification) {
  switch (notification) {
    case 'downloading': return 'baixando';
    case 'zipping': return 'compactando';
    case 'successfully saved': return 'gerado com sucesso';
    case 'Error': return 'Erro';
    default: return notification;
  }
}

const DownloadModal = ({ dicomWebClient, StudyInstanceUID, onClose }) => {
  const [status, setStatus] = useState({ notificationType: '', text: '' });
  const [size, setSize] = useState('');
  const [numberOfFiles, setNumberOfFiles] = useState('');

  useEffect(() => {
    setStatus({
      notificationType: '',
      text: '',
    });
    _downloadAndZip(
      dicomWebClient,
      StudyInstanceUID,
      (notificationType, text) => {
        setStatus({ notificationType: notificationType, text: text });
        if (notificationType === 'downloading') setSize(text);
        if (notificationType === 'zipping') setNumberOfFiles(text);
      }
    )
      .then(url => {
        OHIF.log.info('Arquivos comprimidos com sucesso:', url);
        setStatus({
          notificationType: 'saving',
          text: `${StudyInstanceUID}.zip`,
        });
        saveAs(url, `${StudyInstanceUID}.zip`);
      })
      .then(() => {
        setStatus({
          notificationType: 'successfully saved',
          text: '',
        });
      })
      .catch(error => {
        OHIF.log.error('Erro ao baixar estudo...', error.message);
        setStatus({
          notificationType: 'Error',
          text: error.message,
        });
      });
  }, [StudyInstanceUID, dicomWebClient]);

  let info;
  switch (status.notificationType) {
    case 'downloading':
      info = 'Transferido: ' + status.text;
      break;
    case 'zipping':
      info = 'Arquivos DICOM: ' + status.text;
      break;
    case 'successfully saved':
      info = (
        <span>
          <p>{'Tamanho: ' + size}</p>
          <p>{'Imagens DICOM: ' + numberOfFiles}</p>
          <p>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Ok
            </button>
          </p>
        </span>
      );
      break;
    case 'Error':
      info = (
        <span>
          <p>{status.text}</p>
          <p>
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Ok
            </button>
          </p>
        </span>
      );
      break;
    default:
      info = status.text;
  }
  return (
    <div className="download-study-modal-container">
      <p>Status: {label(status.notificationType)}</p>
      <p>{info}</p>
    </div>
  );
};

DownloadModal.propTypes = {
  dicomWebClient: PropTypes.object.isRequired,
  StudyInstanceUID: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DownloadModal;
