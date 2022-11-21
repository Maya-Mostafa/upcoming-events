import * as React from 'react';
import styles from '../PeelUpcomingEvents.module.scss';
import { IEventProps } from './IEventProps';
import { DateTime } from "luxon";

export default function IEvent (props: IEventProps) {
    
    return(
        <li className={styles.eventItem}>
            <div className={styles.eventDate}>
                {props.event.isRecurrent ?
                    <div className={styles.recurrentDate}>
                        <div>{DateTime.fromISO(props.event.startDate).toFormat('LLL')} {DateTime.fromISO(props.event.startDate).toFormat('dd')}</div>    
                        <div>{DateTime.fromISO(props.event.endDate).toFormat('LLL')} {DateTime.fromISO(props.event.endDate).toFormat('dd')}</div>
                    </div>
                    :
                    <>
                        <div className={styles.eventMonth}>{DateTime.fromISO(props.event.startDate).toFormat('MMM')}</div>
                        <div className={styles.eventDay}>{DateTime.fromISO(props.event.startDate).toFormat('dd')}</div>
                    </>
                }
            </div>
            <div className={styles.eventDetails}>
                <h5><a onClick={props.eventClickHandler}>{props.event.title}</a></h5>
                <div className={styles.eventTimes}>{DateTime.fromISO(props.event.startDate).toFormat('ff')} - {DateTime.fromISO(props.event.endDate).toFormat('tt')}</div>
                <div className={styles.eventLocation}>{props.event.location}</div>
            </div>
        </li>
    )

}