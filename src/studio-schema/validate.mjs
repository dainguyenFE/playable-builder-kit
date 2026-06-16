/**
 * Lightweight JSON validation (no external deps).
 */
export function validatePlayableShape(playable) {
  const errors = [];
  if (!playable?.id) errors.push("playable.json: missing id");
  if (!playable?.name) errors.push("playable.json: missing name");
  if (!playable?.viewport?.width) errors.push("playable.json: missing viewport.width");
  if (!playable?.theme?.backgroundColor) errors.push("playable.json: missing theme.backgroundColor");
  return errors;
}

export function validateScenarioShape(scenario) {
  const errors = [];
  if (!scenario?.id) errors.push("scenario.json: missing id");
  if (!scenario?.entryScreen) errors.push("scenario.json: missing entryScreen");
  if (!Array.isArray(scenario?.screens) || !scenario.screens.length) {
    errors.push("scenario.json: screens must be non-empty array");
    return errors;
  }
  const ids = new Set();
  for (const screen of scenario.screens) {
    if (!screen.id) errors.push("scenario: screen missing id");
    if (screen.id && ids.has(screen.id)) errors.push(`scenario: duplicate screen id ${screen.id}`);
    if (screen.id) ids.add(screen.id);
    if (!Array.isArray(screen.elements)) {
      errors.push(`scenario: screen ${screen.id} missing elements[]`);
    }
  }
  if (scenario.entryScreen && !ids.has(scenario.entryScreen)) {
    errors.push(`scenario: entryScreen "${scenario.entryScreen}" not found`);
  }
  const allowedActions = new Set([
    "show", "hide", "typeText", "navigateScreen", "trackEvent", "pulse",
  ]);
  for (const screen of scenario.screens) {
    for (const step of screen.steps ?? []) {
      if (step.action && !allowedActions.has(step.action)) {
        errors.push(`scenario: unknown action "${step.action}" in ${screen.id}`);
      }
      if (step.action === "navigateScreen" && !step.target) {
        errors.push(`scenario: navigateScreen missing target in ${screen.id}`);
      }
    }
  }
  return errors;
}

export function validateContextShape(context) {
  const errors = [];
  if (!context?.id) errors.push("context.json: missing id");
  if (!context?.productName) errors.push("context.json: missing productName");
  return errors;
}

export function validateStudioPlayable(bundle) {
  return [
    ...validatePlayableShape(bundle.playable),
    ...validateContextShape(bundle.context),
    ...validateScenarioShape(bundle.scenario),
  ];
}
