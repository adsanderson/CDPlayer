import { Machine, assign } from "xstate";

const isEndOfTrack = ctx => {
  return ctx.trackPlayed >= ctx.cd[ctx.track - 1];
};

const isLastTrack = ctx => ctx.track === ctx.cd.length;

const isWithinPreviousWindow = ctx => ctx.track > 1 && ctx.trackPlayed <= 3;

const isEndOfCD = ctx => {
  return isEndOfTrack(ctx) && isLastTrack(ctx);
};

const resetPlayer = assign(() => ({
  track: 1,
  trackPlayed: 0
}));

export const cdPlayerMachine = Machine({
  id: "cdPlayer",
  initial: "no_cd_loaded",
  context: {
    cd: [],
    track: 1,
    trackPlayed: 0
  },
  states: {
    no_cd_loaded: {
      initial: "cd_drawer_closed",
      states: {
        cd_drawer_closed: {
          on: {
            EJECT: "cd_drawer_open"
          },
          meta: {
            test: () => true
          }
        },
        cd_drawer_open: {
          on: {
            EJECT: "cd_drawer_closing"
          },
          meta: {
            test: () => true
          }
        },
        cd_drawer_closing: {
          on: {
            "": [
              {
                target: "cd_drawer_closed",
                cond: () => false
              },
              {
                target: "#cd_loaded",
                actions: assign({
                  cd: [10, 10, 5],
                  track: 1,
                  trackPlayed: 0
                })
              }
            ]
          },
          meta: {
            test: () => true
          }
        }
      },
      meta: {
        test: async () => {}
      }
    },
    cd_loaded: {
      id: "cd_loaded",
      initial: "anon",
      states: {
        anon: {
          initial: "cd_stopped",
          states: {
            cd_stopped: {
              on: {
                PLAY: "cd_playing"
              },
              meta: {
                test: () => true
              }
            },
            cd_playing: {
              on: {
                STOP: {
                  target: "cd_stopped",
                  actions: resetPlayer
                },
                PAUSE: "cd_paused"
              },
              after: {
                1000: [
                  {
                    target: "cd_stopped",
                    cond: isEndOfCD,
                    actions: resetPlayer
                  },
                  {
                    target: "cd_playing",
                    cond: isEndOfTrack,
                    actions: assign(ctx => ({
                      track: ctx.track + 1,
                      trackPlayed: 0
                    }))
                  },
                  {
                    target: "cd_playing",
                    actions: assign({
                      trackPlayed: ctx => ctx.trackPlayed + 1
                    })
                  }
                ]
              },
              meta: {
                test: () => true
              }
            },
            cd_paused: {
              on: {
                STOP: {
                  target: "cd_stopped",
                  actions: resetPlayer
                },
                PLAY: "cd_playing",
                PAUSE: "cd_playing"
              },
              initial: "time_track_blank",
              states: {
                time_track_blank: {
                  after: {
                    1000: "time_track_not_blank"
                  }
                },
                time_track_not_blank: {
                  after: {
                    1000: "time_track_blank"
                  }
                }
              },
              meta: {
                test: () => true
              }
            },
            hist: {
              type: "history"
            }
          },
          on: {
            FORWARD_DOWN: "stepping_forward",
            REVERSE_DOWN: "stepping_backwards",
            NEXT_TRACK: [
              {
                target: "anon.cd_stopped",
                cond: isLastTrack,
                actions: resetPlayer
              },
              {
                target: "anon.hist",
                actions: assign(ctx => ({
                  track: ctx.track + 1,
                  trackPlayed: 0
                }))
              }
            ],
            PREV_TRACK: [
              {
                target: "anon.hist",
                cond: isWithinPreviousWindow,
                actions: assign(ctx => ({
                  track: ctx.track - 1,
                  trackPlayed: 0
                }))
              },
              {
                target: "anon.hist",
                actions: assign(() => ({
                  trackPlayed: 0
                }))
              }
            ]
          },
          meta: {
            test: () => true
          }
        },
        stepping_forward: {
          after: {
            150: [
              {
                target: "anon.cd_stopped",
                cond: isEndOfCD,
                actions: resetPlayer
              },
              {
                target: "stepping_forward",
                cond: isEndOfTrack,
                actions: assign(ctx => ({
                  track: ctx.track + 1,
                  trackPlayed: 0
                }))
              },
              {
                target: "stepping_forward",
                actions: assign({
                  trackPlayed: ctx => ctx.trackPlayed + 3
                })
              }
            ]
          },
          on: {
            FORWARD_UP: "anon.hist"
          },
          meta: {
            test: () => true
          }
        },
        stepping_backwards: {
          after: {
            150: [
              {
                target: "stepping_backwards",
                actions: assign({
                  trackPlayed: ctx =>
                    ctx.trackPlayed <= 3 ? 0 : ctx.trackPlayed - 3
                })
              }
            ]
          },
          on: {
            REVERSE_UP: "anon.hist"
          },
          meta: {
            test: () => true
          }
        }
      },
      on: {
        EJECT: {
          target: "no_cd_loaded.cd_drawer_open",
          actions: assign({
            cd: [],
            track: 1
          })
        }
      },
      meta: {
        test: () => true
      }
    }
  }
});
