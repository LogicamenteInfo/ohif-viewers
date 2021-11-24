import OHIF from '@ohif/core';
import DownloadModal from './DownloadModal';
import React from 'react';
import { getDicomWebClientFromContext } from './utils';

const {
  utils: { Queue },
} = OHIF;

export function getCommands(context, servicesManager, extensionManager) {
  const queue = new Queue(1);
  const { UIModalService } = servicesManager.services;
  const actions = {
    downloadAndZipStudyOnActiveViewport({ servers, viewports, progress }) {
      const dicomWebClient = getDicomWebClientFromContext(context, servers);

      const { activeViewportIndex, viewportSpecificData } = viewports;
      const activeViewportSpecificData =
        viewportSpecificData[activeViewportIndex];

      const { StudyInstanceUID } = activeViewportSpecificData;

      const WrappedDownloadModal = function() {
        return (
          <DownloadModal
            dicomWebClient={dicomWebClient}
            StudyInstanceUID={StudyInstanceUID}
            onClose={UIModalService.hide}
          />
        );
      };

      UIModalService.show({
        content: WrappedDownloadModal,
        title: `Baixar estudo`,
        fullscreen: false,
        noScroll: true,
        shouldCloseOnEsc: false,
        closeButton: false,
      });
    },
  };

  const definitions = {
    downloadAndZipStudyOnActiveViewport: {
      commandFn: queue.bindSafe(
        actions.downloadAndZipStudyOnActiveViewport,
        e => error(e)
      ),
      storeContexts: ['servers', 'viewports'],
    },
  };

  return {
    actions,
    definitions,
  };
}

/**
 * Utils
 */

function error(e) {
  if (e.message === 'Limite da fila alcançado') {
    OHIF.log.warn('Um download já está em progresso, aguarde por favor.');
  } else {
    OHIF.log.error(e);
  }
}
