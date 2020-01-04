import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";


export const rotateOnChange = trigger('rotateOnChange', [
  transition('* => *',[
    style({transform: 'rotate(-90deg)'}),
    animate('200ms')
  ])
  ]);


export const fadeOnChange = trigger('fadeOnChange', [
  transition(':leave', [
    animate('200ms',
      style({
        opacity: 0,
        height: 'calc(var(--header-height) * 0.8)',
        width: 'calc(var(--header-height) * 0.8)'
      })
    )
  ]),
  transition(':enter', [
    style({
      opacity: 0,
      height: 'calc(var(--header-height) * 0.8)',
      width: 'calc(var(--header-height) * 0.8)'
    }),
    animate('200ms',
      style({
        opacity: 1,
        height: 'var(--header-height)',
        width: 'var(--header-height)'
      })
    )
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
    ]),


    // Expand detail view from bottom
    transition('Overview => PaymentView', [
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
        // Place the enter view at the bottom with a height of 0
        query(':enter', [style({
          overflowY: 'hidden',
          position: 'absolute',
          bottom: 0,
          right: 0,
          height: 0,
          width: '100%',
          paddingTop: 'var(--header-height)',
          zIndex: 2
        })]),
        // Set the height of the payment view detail container to 100%
        query('.detail-container', [style({
          marginTop: 0,
          height: '100%'
        })])
      ]),
      query(':leave', animateChild()),
      // Expand the enter view from the bottom
      query(':enter', [
        animate('150ms ease-out', style({
          height: 'calc(100vh - var(--header-height))',
        }))
      ]),
      // Move the detail container down to reveal the payment detail header
      query('.detail-container', [
        animate('200ms ease-out', style({
          marginTop: 'calc(var(--header-height)/2 + var(--payment-header-height))'
        }))
      ]),
      query(':enter', animateChild()),
    ]),


    // Collapse detail view into bottom
    transition('PaymentView => Overview', [
      // Set up views
      group([
        // Keep the leave view fixed
        query(':enter', [style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          paddingTop: 'var(--header-height)'
        })],{
          limit: 1
        }),
        // Place the enter view at the bottom with a height of 0
        query(':leave', [style({
          overflowY: 'hidden',
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: 'calc(100vh - var(--header-height))',
          // z-depth 2 reversed:
          '-webkit-box-shadow': '0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12)',
          'box-shadow': '0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12)'
        })],{
          limit: 1
        }),
        // Set height of detail container to 100% for later
        query('.detail-container', [ style({
            height: '100%'
          })
        ]),
      ]),
      query(':leave', animateChild()),
      // Expand the detail container over the whole view
      query('.detail-container', [
        animate('150ms ease-out', style({
          marginTop: '0'
        }))
      ]),
      // Collapse the leave view into the bottom
      query(':leave', [
        animate('150ms ease-in', style({
          height: 0
        }))
      ]),
      query(':enter', animateChild()),
    ]),

  ]);
