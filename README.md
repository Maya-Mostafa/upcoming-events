# upcoming-events

## Summary

Short summary on functionality and used technologies.

[picture of the solution in action, if possible]


## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

> Include any additional steps as needed.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

----------------------------------------------------------

## Creating a SPFx wp, build, deploy

  > yo @microsoft/sharepoint<br/>
  > gulp serve<br/>

  > gulp serve --nobrowser<br/>
  > gulp package-solution<br/>

  > gulp clean<br/>
  > gulp build<br/>
  
  > gulp bundle --ship<br/>
  > gulp package-solution --ship<br/>


## Libraries 

  > npm i @pnp/sp
  > npm install @pnp/spfx-controls-react --save --save-exact


## Features

1. listing upcoming events from a chosen list anywhere in the site (will hard code the url initially)
2. display title, date, start & end dates, locations
3. opens the details in popup
4. custom web part options for list query. Check the requirments below.
5. paging?

## Requirements
	- Source: Select a site
	- Events Lists
	- Category
	- Date range
	- Number of events to display
	- If possible target audience


## Current Implementation
https://pdsb1.sharepoint.com/sites/PDSBCalendars/SitePages/PL.aspx


## list to query
https://pdsb1.sharepoint.com/sites/PLCalendar/Lists/Events/calendar.aspx
## Rest call for the events
https://pdsb1.sharepoint.com/sites/PLCalendar/_api/web/lists/getByTitle('Events')/items


### References
- Pnp
  https://pnp.github.io/pnpjs/
- PnP controls
https://pnp.github.io/sp-dev-fx-controls-react/controls
- Fluent UI
https://developer.microsoft.com/en-us/fluentui#/controls/web
