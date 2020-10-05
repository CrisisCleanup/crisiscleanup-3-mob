import { colors, templates } from '../icon_templates';

const getWorkTypeImage = (workType) => {
  const colorsKey = `${workType.status}_${
    workType.claimed_by ? 'claimed' : 'unclaimed'
  }`;
  const worksiteTemplate = templates[workType.work_type] || templates.unknown;
  const svgColors = colors[colorsKey];

  if (svgColors) {
    return worksiteTemplate
      .replace('{{fillColor}}', svgColors.fillColor)
      .replace('{{strokeColor}}', svgColors.strokeColor)
      .replace('{{multiple}}', '');
  }
  return null;
};

export { getWorkTypeImage };
