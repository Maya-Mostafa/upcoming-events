import * as React from 'react';
import { IEventProps } from './IEventProps';

export default function IEvent (props: IEventProps) {
    
    return(
        <li>
            <div><label>Title:</label><span>{props.event.Title}</span></div>
            <div><label>Start Date:</label><span>{props.event.EventDate}</span></div>
            <div><label>End Date:</label><span>{props.event.EndDate}</span></div>
        </li>
    )

}