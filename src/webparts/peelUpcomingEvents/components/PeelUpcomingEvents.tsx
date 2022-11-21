/* eslint-disable react/jsx-no-bind */

import * as React from 'react';
import styles from './PeelUpcomingEvents.module.scss';
import { IPeelUpcomingEventsProps } from './IPeelUpcomingEventsProps';
import {getEvents} from '../services/requests';
import IEvent from '../components/IEvent/IEvent';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
// import { IFrameDialog } from "@pnp/spfx-controls-react/lib/IFrameDialog";
import { Label, Modal, mergeStyleSets, getTheme, IconButton } from 'office-ui-fabric-react';
import { escape } from '@microsoft/sp-lodash-subset';
import './pnpPagination.scss';
import IEventDetails from './IEventDetails/IEventDetails';

export default function PeelUpcomingEvents(props: IPeelUpcomingEventsProps){

  const [events, setEvents] = React.useState([]);
  const [paginatedEvents, setPaginatedEvents] = React.useState([]);
  const [dialogHidden, setDialogHidden] = React.useState(true);
  // const [eventUrl, setEventUrl] = React.useState('');
  const [selectedEvent, setSelectedEvent] = React.useState({});

  React.useEffect(() => {

    getEvents(props.context, props.siteUrl, props.eventsList, props.dateRange, props.numEvents).then(results => {
      console.log("results", results);
      setEvents(results);
      setPaginatedEvents(results.slice(0, props.pageSize));
    });

  }, [props.context, props.siteUrl, props.pageSize, props.targetAudience, props.dateRange, props.numEvents]);


  const getPage = (page: number) => {
    const roundupPage = Math.ceil(page);
    setPaginatedEvents(events.slice(roundupPage * props.pageSize, (roundupPage * props.pageSize) + props.pageSize))
  };

  const openDialog = (event) => {
    setSelectedEvent(event);
    setDialogHidden(false);
  };

  const theme = getTheme();
  const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
      width: '600px',
      height: '600px'
    },
    header: {
        borderTop: `4px solid ${theme.palette.themePrimary}`,
        color: theme.palette.neutralPrimary,
        display: 'flex',
        justifyContent: 'flex-end',
      },
  });

  return (
		<div className={styles.peelUpcomingEvents}>
      <Label className={styles.wpTitle}>
        {escape(props.wpTitle)}
      </Label>
      {props.showPaging && (
        <>
          <ul>
            {paginatedEvents.map((event, index) => {
              return (
                <IEvent
                  key={index}
                  event={event}
                  eventClickHandler={() => openDialog(event)}
                />
              );
            })}
          </ul>
          {events.length > props.pageSize &&
            <Pagination
              currentPage={1}
              totalPages={events.length / props.pageSize - 1}
              onChange={(page) => getPage(page)}
              limiter={3}
            />
          }
        </>
      )}
      {!props.showPaging && (
        <>
          <ul>
            {events.map((event, index) => {
              return (
                <IEvent
                  key={index}
                  event={event}
                  eventClickHandler={() => openDialog(event)}
                />
              );
            })}
          </ul>
        </>
      )}
      
      {/* <IFrameDialog
        url={eventUrl}
        // iframeOnLoad={onIframeLoaded}
        hidden={dialogHidden}
        onDismiss={() => setDialogHidden(true)}
        modalProps={{
          isBlocking: true,
        }}
        dialogContentProps={{
          type: DialogType.close,
          showCloseButton: true,
        }}
        width={"570px"}
        height={"600px"}
      /> */}
      
      <Modal
        isOpen={!dialogHidden}
        onDismiss={() => setDialogHidden(true)}
        isBlocking={false}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel="Close popup modal"
            onClick={() => setDialogHidden(true)}
          />
        </div>
        <IEventDetails event={selectedEvent}  />
        {/* <div className={styles.modalBtn}>
          <DefaultButton
            onClick={() => setDialogHidden(true)}
            text="Close"
          />
        </div> */}
      </Modal>

      {/* <Dialog
        hidden={dialogHidden}
        onDismiss={() => setDialogHidden(true)}
        
      >
        <IEventDetails event={selectedEvent}  />
        <DialogFooter>
          <DefaultButton
            onClick={() => setDialogHidden(true)}
            text="Close"
          />
        </DialogFooter>
      </Dialog> */}
	
		</div>
  );
}


