import axe from "axe-core";

/** Runs axe on a rendered container and fails with a readable list of violations. */
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    // Page-level rules don't apply to isolated components.
    rules: { region: { enabled: false } },
  });
  const messages = results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`
  );
  expect(messages).toEqual([]);
}
