import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";


export const rotateOnChange = trigger('rotateOnChange', [
  transition('* => *',[
    style({transform: 'rotate(-90deg)'}),
    animate('100ms')
  ])
  ]);


export const expandFromFAB =
  trigger('routeAnimations', [

    // Expand editor from FAB
    transition('* => Editor', [
      // Set up views
      group([
        // Keep the leave view fixed
        query(':leave', [style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          paddingTop: 'var(--header-height)'
        })],{
          limit: 1
        }),
        // Remove the FAB-icon
        query('.fab-icon', [style({
          display: 'none'
        })]),
        // Place the enter view under the FAB and make it opaque
        query(':enter', [style({
          overflowY: 'hidden',
          overflowX: 'hidden',
          position: 'absolute',
          bottom: '25px',
          right: '25px',
          height: '56px',
          width: '56px',
          opacity: -2,
          borderRadius: '50%',
          zIndex: 3
        })])
      ]),
      query(':leave', animateChild()),

      group([
        // Expand the FAB over the whole view, switch the background-color and increase the opacity
        query('.fab-button', [
          animate('300ms ease-out', style({
            bottom: 0,
            right: 0,
            height: 'calc(100vh - var(--header-height))',
            width: '100vw',
            opacity: 1,
            borderRadius: 0,
            backgroundColor: '#e3f2fd'
          }))
        ]),
        // Expand the enter view and increase the opacity
        query(':enter', [
          animate('300ms ease-out', style({
            bottom: 0,
            right: 0,
            height: 'calc(100vh - var(--header-height))',
            width: '100vw',
            opacity: 1,
            borderRadius: 0
          }))
        ]),
      ]),
      query(':enter', animateChild()),
    ]),


    // Collapse editor into FAB
    transition('Editor => *', [
      // Set up views
      group([
        // Keep the leave view fixed
        query(':enter', [style({
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: 'calc(100vh - var(--header-height))'
        })], {
          limit: 1
        }),
        query(':leave', [style({
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: 'calc(100vh - var(--header-height))',
          zIndex: 3,
          overflowY: 'hidden',
          overflowX: 'hidden',
        })], {
          limit: 1
        }),
        query('.fab-button', [style({
          bottom: 0,
          right: 0,
          width: '100%',
          height: 'calc(100vh - var(--header-height))',
          borderRadius: 0,
          backgroundColor: '#e3f2fd'
        })]),
        query('.fab-icon', [style({
          display: 'none'
        })])
      ]),
      query(':leave', animateChild()),

      group([
        // Expand the FAB over the whole view, switch the background-color and increase the opacity
        query('.fab-button', [
          animate('250ms ease-in', style({
            bottom: '25px',
            right: '25px',
            height: '56px',
            width: '56px',
            borderRadius: '50%',
            backgroundColor: '#e53935'
          }))
        ]),

        query(':leave', [
          animate('250ms ease-in', style({
            overflowY: 'hidden',
            overflowX: 'hidden',
            bottom: '25px',
            right: '25px',
            height: '56px',
            width: '56px',
            borderRadius: '50%',
            opacity: -2
          }))
        ]),
      ]),
      query(':enter', animateChild()),
    ])

  ]);
