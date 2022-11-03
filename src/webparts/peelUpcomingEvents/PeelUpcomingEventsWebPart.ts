import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';
// import { PropertyFieldPeoplePicker, IPropertyFieldGroupOrPerson, PrincipalType } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPHttpClient } from '@microsoft/sp-http';

import * as strings from 'PeelUpcomingEventsWebPartStrings';
import PeelUpcomingEvents from './components/PeelUpcomingEvents';
import { IPeelUpcomingEventsProps } from './components/IPeelUpcomingEventsProps';

export interface IPeelUpcomingEventsWebPartProps {
  wpTitle: string;
  eventsList: string;
  siteUrl: string;
  dateRange: string;
  numEvents: number;
  showPaging: boolean;
  pageSize: number;
  targetAudience: any;
}

export default class PeelUpcomingEventsWebPart extends BaseClientSideWebPart<IPeelUpcomingEventsWebPartProps> {
  
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
 
  /* Loading Dpd with list names - Start */
  private _lists: IPropertyPaneDropdownOption[];
  private async _loadLists(): Promise<IPropertyPaneDropdownOption[]> {    
    const listsTitle : any = [];
    try {
      // https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-wssts/8bf797af-288c-4a1d-a14b-cf5394e636cf
      const response = await this.context.spHttpClient.get(this.properties.siteUrl + `/_api/web/lists?$select=Title&$filter=BaseType eq 0 and BaseTemplate eq 106 and Hidden eq false`, SPHttpClient.configurations.v1);
      if (response.ok) {
        const results = await response.json();
        if(results){
          //console.log('results', results);
          results.value.map((result: any)=>{
            listsTitle.push({
              key: result.Title,
              text: result.Title
            });
          });
          return listsTitle;
        }
      }
    } catch (error) {
      return error.message;
    }
  }
  protected onPropertyPaneConfigurationStart(): void {
    if (this._lists) {
      this.render();  
      return;
    }
    this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'lists');
    this._loadLists()
      .then((listOptions: IPropertyPaneDropdownOption[]): void => {
        this._lists = listOptions;
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);        
        this.render();       
      });
  } 
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'listName' && newValue) {
      // push new list value
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
      // refresh the item selector control by repainting the property pane
      this.context.propertyPane.refresh();
      // re-render the web part as clearing the loading indicator removes the web part body
      this.render();      
    }
    else {
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, oldValue);
    }
  }
  /* Loading Dpd with list names - End */

  public render(): void {
    const element: React.ReactElement<IPeelUpcomingEventsProps> = React.createElement(
      PeelUpcomingEvents,
      {
        isDarkTheme: this._isDarkTheme,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        
        wpTitle: this.properties.wpTitle,
        context: this.context,
        eventsList: this.properties.eventsList,
        siteUrl: this.properties.siteUrl,
        dateRange: this.properties.dateRange,
        numEvents: this.properties.numEvents,
        showPaging: this.properties.showPaging,
        pageSize: this.properties.pageSize,
        targetAudience: this.properties.targetAudience
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'A Peel web part that displays upcoming events from the calendar list in the site or another site.'
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('wpTitle', {
                  label: 'Title',
                  value: this.properties.wpTitle,
                }),
              ]
            },
            {
              groupName: 'Events source',
              groupFields: [
                PropertyPaneTextField('siteUrl', {
                  label: 'Site link',
                  value: this.context.pageContext.web.serverRelativeUrl,
                  description: 'By default, this is the current site URL. Please specify a different URL if needed.'
                }),
                PropertyPaneDropdown('eventsList', {
                  label: 'List name',
                  options: this._lists,
                }),
              ]
            },
            {
              groupName: 'Display options',
              groupFields: [
                PropertyPaneDropdown('dateRange', {
                  label: 'Date range',
                  options: [
                    { key: 'all', text: 'All upcoming events'},
                    { key: 'thisWeek', text: 'This week' },
                    { key: 'nextTwoWeeks', text: 'Next two weeks' },
                    { key: 'thisMonth', text: 'This month' },
                    { key: 'thisQuarter', text: 'This quarter' },
                  ],
                  selectedKey : 'all'
                }),
                PropertyFieldNumber('numEvents', {
                  key: "numEvents",
                  label: "Show up to this many events",
                  description: "Minumum is 5, maximum is 500",
                  value: this.properties.numEvents,
                  maxValue: 500,
                  minValue: 5,
                  disabled: false
                }),
              ]
            },
            {
              groupName: 'Paging options',
              groupFields: [
                PropertyPaneToggle('showPaging', {
                  label: 'Show paging',
                  onText: 'On',
                  offText: 'Off',
                  checked : false
                }),
                PropertyPaneSlider('pageSize', {
                  label: 'Number of events per page',
                  min: 5,
                  max: 50,
                  value: this.properties.pageSize,
                  disabled: !this.properties.showPaging,
                  step : 5,
                  showValue: true,
                })
              ]
            },
            // {
            //   groupName: 'Target audience',
            //   groupFields: [
            //     PropertyFieldPeoplePicker('targetAudience', {
            //       label: 'Who can see this webpart?',
            //       initialData: this.properties.targetAudience,
            //       allowDuplicate: false,
            //       principalType: [PrincipalType.Users, PrincipalType.SharePoint, PrincipalType.Security],
            //       onPropertyChange: this.onPropertyPaneFieldChanged,
            //       context: this.context as any,
            //       properties: this.properties,
            //       onGetErrorMessage: null,
            //       deferredValidationTime: 0,
            //       key: 'peopleFieldId'
            //     })
            //   ]
            // }
          ]
        }
      ]
    };
  }
}
