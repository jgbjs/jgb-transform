import { fixExternalClass } from "../src/transform/transfromAttrValue";

describe("fixExternalClass", () => {
  it(`mathc: class="custom-class"`, () => {
    const attrs = {
      class: 'custom-class'
    }
    fixExternalClass(attrs)
    expect(attrs.class).toBe(`{{fixcustomClass ? fixcustomClass : 'custom-class'}}`)
  });

  it(`not match: class="custom-class1"`, () => {
    const attrs = {
      class: 'custom-class1'
    }
    fixExternalClass(attrs)
    expect(attrs.class).toBe(`custom-class1`)
  });

  it(`mulity classes: class="before-class custom-class other-class"`, () => {
    const attrs = {
      class: 'before-class custom-class other-class'
    }
    fixExternalClass(attrs)
    expect(attrs.class).toBe(`before-class {{fixcustomClass ? fixcustomClass : 'custom-class'}} other-class`)
  });
});
