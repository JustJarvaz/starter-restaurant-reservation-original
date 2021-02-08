async function selectOptionByText(page, name, optionText) {
  const optionWaned = (
    await page.$x(`//*[@name = "${name}"]/option[text() = "${optionText}"]`)
  )[0];

  const optionValue = await (
    await optionWaned.getProperty("value")
  ).jsonValue();

  await page.select(`[name=${name}`, optionValue);
}

module.exports = {
  selectOptionByText,
};
