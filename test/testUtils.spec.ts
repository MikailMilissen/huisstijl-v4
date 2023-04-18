import {expect} from '@open-wc/testing';
import {LitElement} from 'lit';


let seededRandomNrGenerator = Math.random

export const testUtils = {
  rand: {
    string: (length: number = 64): string => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {

        result += characters.charAt(Math.round(seededRandomNrGenerator() * length));
      }
      return result;
    },
    int: (min: number = Number.MIN_VALUE, max: number = Number.MAX_VALUE): number => {
      const range = max - min + 1;
      let rand = seededRandomNrGenerator();
      return Math.floor(rand * range + min);
    },
    float: (min: number = Number.MIN_VALUE, max: number = Number.MAX_VALUE, decimals: number = 10): number => {
      const range = max - min + 1;
      const floatAsString = (seededRandomNrGenerator() * range + min).toFixed(decimals);
      return parseFloat(floatAsString);
    }
  },
  simulate: {
    event: (nativeElement: Element, event: Event): void => {
      nativeElement.dispatchEvent(event);
    },
    input: (nativeElement: Element, eventInitDict: EventInit | undefined = undefined): void => {
      testUtils.simulate.event(nativeElement, new Event("input", eventInitDict));
    },
    click: (nativeElement: Element, eventInitDict: EventInit | undefined = undefined): void => {
      testUtils.simulate.event(nativeElement, new Event("click", eventInitDict));
    },
    focus: (nativeElement: Element, eventInitDict: EventInit | undefined = undefined): void => {
      testUtils.simulate.event(nativeElement, new Event("focus", eventInitDict));
    },
    blur: (nativeElement: Element, eventInitDict: EventInit | undefined = undefined): void => {
      testUtils.simulate.event(nativeElement, new Event("blur", eventInitDict));
    },
    change: (nativeElement: Element, eventInitDict: EventInit | undefined = undefined): void => {
      testUtils.simulate.event(nativeElement, new Event("change", eventInitDict));
    },
    slotChange: (nativeElement: Element, eventInitDict: EventInit | undefined = undefined): void => {
      testUtils.simulate.event(nativeElement, new Event("slotchange", eventInitDict));
    },
    mouseEnter: (nativeElement: Element, eventInitDict: MouseEventInit | undefined = undefined): void => {
      testUtils.simulate.event(nativeElement, new Event("mouseenter", eventInitDict));
    },
    mouseLeave: (nativeElement: Element, eventInitDict: MouseEventInit | undefined = undefined): void => {
      testUtils.simulate.event(nativeElement, new Event("mouseleave", eventInitDict));
    },
    singleKeyInput: (nativeElement: Element, type: "keyup" | "keypress" | "keydown", eventInitDict: KeyboardEventInit | undefined = undefined): void => {
      testUtils.simulate.event(nativeElement, new KeyboardEvent(type, eventInitDict));
    },
    multiKeyInput: (nativeElement: Element, type: "keyup" | "keypress" | "keydown", characters: string, eventInitDict: KeyboardEventInit | undefined = undefined): void => {
      for (let i = 0; i < characters.length; ++i) {
        const eventInitDictForCharacter: KeyboardEventInit = {
          ...eventInitDict,
          ...{key: characters[i]}
        }
        testUtils.simulate.singleKeyInput(nativeElement, type, eventInitDictForCharacter);
      }
    },
  },
  query: {
    component: <T>(root: HTMLElement | ShadowRoot, selector: string): T => {
      return root.querySelector(`${selector}`) as T;
    },
    allComponents: <T>(root: HTMLElement | ShadowRoot, selector: string): T[] => {
      return Array.from(root.querySelectorAll(`${selector}`)) as T[];
    },
    componentByE2e: <T>(root: HTMLElement | ShadowRoot, selector: string): T => {
      return testUtils.query.component<T>(root, `[data-e2e="${selector}"]`);
    },
    // allComponentsByE2eStartingWith: <T>(fixture: ComponentFixture<T>, selector: string): DebugElement[] => {
    //   // Don't touch this code. JQuery style selectors didn't work
    //   const all = testUtils.query.allComponents(fixture, `[data-e2e]`);
    //   return all.filter(b => b.attributes["data-e2e"]?.startsWith(selector));
    // },

  },
  expect: {
    elementToBeDefined: (element: Element, expectedResult: boolean = true) => {
      return expectedResult ? expect(element).to.exist : expect(element).not.to.exist;
    },
    classToContain: (element: Element, className: string | undefined, expectedResult: boolean = true): void => {
      let classList = Object.values(element.classList);
      if (expectedResult) {
        expect(classList).to.contain(className);
      } else {
        expect(classList).not.to.contain(className);
      }
    },
    notClassToContain: (element: Element, className: string): void => {
      return testUtils.expect.classToContain(element, className, false)
    },
    textContentToBe: (element: Element, textContent: string): Promise<Chai.Assertion> => {
      return expect(element.textContent).to.equal(textContent)
    },
    //     matchSnapshot: <T = unknown>(fixture: ComponentFixture<T>) => {

    //       if (global.seed === 0)
    //         expect(fixture).toMatchSnapshot();
    //     }
  },
  lifecycle: {
    waitForUpdate: async (element: LitElement) => {
      element.requestUpdate();
      await element.updateComplete;
    }
  },
  debug: {
    shadowRoot: (element: Element) => {
      console.log(element.shadowRoot);
    },
    innerHTML: (element: Element) => {
      console.log(element.innerHTML);
    }
  }
}

export const componentToHex = (c: number): string => {
  let hex = c.toString(16);
  return hex.length == 1 ? `0${hex}` : hex;
}

export const rgbToHex = (r: number, g: number, b: number) => {
  const rgbToHex = `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
  return rgbToHex;
}

export const parseRgbStyleToHex = (rgbAsStyle: string): string => {
  const rgbAsArray = rgbAsStyle
    .slice(4)             // slice first part "rgb("
    .slice(0, -1)         // slice last part ")"
    .split(","); // split remaining string in separate rgb elements
  return rgbToHex(Number(rgbAsArray[0]), Number(rgbAsArray[1]), Number(rgbAsArray[2]))
}
