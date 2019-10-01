import React from "react";
import { createModel } from "@xstate/test";
import { render, cleanup, fireEvent } from "@testing-library/react";

import { cdPlayerMachine } from "../cd-player.machine";
import { CDPlayer } from "../CDPlayer";

const cdPlayerModel = createModel(cdPlayerMachine).withEvents({
  EJECT: {
    exec: async ({ renderResult }) => {
      fireEvent.click(renderResult.getByTitle("Eject"));
    }
  },
  PLAY: {
    exec: async ({ renderResult }) => {
      fireEvent.click(renderResult.getByTitle("Play/Pause"));
    }
  },
  FORWARD_DOWN: {
    exec: async ({ renderResult }) => {
      fireEvent.mouseDown(renderResult.getByTitle("Fast forward"));
    }
  },
  FORWARD_UP: {
    exec: async ({ renderResult }) => {
      fireEvent.mouseUp(renderResult.getByTitle("Fast forward"));
    }
  },
  NEXT_TRACK: {
    exec: async ({ renderResult }) => {
      fireEvent.mouseUp(renderResult.getByTitle("Skip next"));
    }
  },
  PREV_TRACK: {
    exec: async ({ renderResult }) => {
      fireEvent.mouseUp(renderResult.getByTitle("Skip previous"));
    }
  },
  REVERSE_DOWN: {
    exec: async ({ renderResult }) => {
      fireEvent.mouseDown(renderResult.getByTitle("Rewind"));
    }
  },
  REVERSE_UP: {
    exec: async ({ renderResult }) => {
      fireEvent.mouseUp(renderResult.getByTitle("Rewind"));
    }
  },
  PAUSE: {
    exec: async ({ renderResult }) => {
      fireEvent.click(renderResult.getByTitle("Play/Pause"));
    }
  },
  "xstate.after(1000)#cdPlayer.cd_loaded.anon.cd_playing": {
    exec: () => {}
  },
  "xstate.after(150)#cdPlayer.cd_loaded.stepping_forward": {
    exec: () => {}
  },
  "xstate.after(1000)#cdPlayer.cd_loaded.anon.cd_paused.time_track_blank": {
    exec: () => {}
  }
});

afterEach(cleanup);

describe("toggle", () => {
  const testPlans = cdPlayerModel.getShortestPathPlans();

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, async () => {
          // do any setup, then...

          const renderResult = render(<CDPlayer />);

          await path.test({ renderResult });
        });
      });
    });
  });

  it("should have full coverage", () => {
    return cdPlayerModel.testCoverage();
  });
});
