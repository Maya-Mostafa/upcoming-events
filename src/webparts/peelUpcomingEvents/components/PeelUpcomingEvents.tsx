/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import styles from './PeelUpcomingEvents.module.scss';
import { IPeelUpcomingEventsProps } from './IPeelUpcomingEventsProps';
import {getEvents} from '../services/requests';
import IEvent from '../components/IEvent/IEvent';

export default function PeelUpcomingEvents(props: IPeelUpcomingEventsProps){


  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    //run this code fnc()

    getEvents(props.context).then(results => {
      console.log(results);
      setEvents(results);
    });

  }, []);


  return(
    <div className={styles.peelUpcomingEvents}>
      <h3>Events</h3>
      <ul>
        {events.map((event, index) => {
          return (
            <IEvent key={index} event={event}/>
          )
        })}
      </ul>

    </div>
  );
}


