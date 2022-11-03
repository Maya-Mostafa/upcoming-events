/* eslint-disable react/self-closing-comp */
import * as React from 'react';
import styles from '../PeelUpcomingEvents.module.scss';
import { IEventDetailsProps } from './IEventDetailsProps';
import { DateTime } from "luxon";

export default function IEventDetails (props: IEventDetailsProps) {
    
    return(
        <div className={styles.eventDlg}>
            
            <header>
                {/* <img src={require('../../assets/aqua_blue_bg.jpg')} /> */}
                <h1>
                    <span className={styles.eventDate}>
                        <div className={styles.eventMonth}>{DateTime.fromISO(props.event.startDate).toFormat('LLL')}</div>
                        <div className={styles.eventDay}>{DateTime.fromISO(props.event.startDate).toFormat('L')}</div>
                    </span>
                    <span className={styles.title}>{props.event.title}</span>
                </h1>
            </header>

            <section>
                <h2>When</h2>
                <div>
                    {DateTime.fromISO(props.event.startDate).toFormat('DDDD')}
                    <br/>
                    {DateTime.fromISO(props.event.startDate).toFormat('t')} - {DateTime.fromISO(props.event.endDate).toFormat('t')}
                    <br/>
                    {DateTime.fromISO(props.event.startDate).toFormat('ZZZZZ')}
                </div>
            </section>

            <section>
                <h2>Where</h2>
                <div>{props.event.location}</div>
            </section>

            <section>
                <h2>Category</h2>
                <div>{props.event.category}</div>
            </section>

            <section className={styles.evDescp}>
                <h2>About this event</h2>
                <div><p dangerouslySetInnerHTML={{__html: props.event.description}}></p></div>
            </section>
            
        </div>
    )

}