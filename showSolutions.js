export default function (solutions) {
  const d = document;

  const containerTemplate = d.getElementById('solution-container-template'),
        solutionTemplate = d.getElementById('solution-template'),
        solutionDestination = d.getElementById('solutions');

  const showSolutions = (fragment, destination, button, {
    getInput, processInput, partOne, partTwo
  }) => () => {
    destination.removeChild(button);
    destination.append(fragment);
    getInput().then(puzzleInput => {
      const processedInput = processInput(puzzleInput);
      destination.querySelector('.part-1').textContent += partOne(processedInput);
      destination.querySelector('.part-2').textContent += partTwo(processedInput);
    });
  };

  for (const [day, functions] of Object.entries(solutions)) {
    const containerTemplateCopy = containerTemplate.content.cloneNode(true),
          solutionTemplateCopy = solutionTemplate.content.cloneNode(true);
    const article = containerTemplateCopy.querySelector('article'),
          dayName = containerTemplateCopy.querySelector('h2'),
          button = containerTemplateCopy.querySelector('button');
    dayName.innerText = `Day ${Number(day.match(/\d+/)[0])}`;
    button.addEventListener('click', showSolutions(
      solutionTemplateCopy, article, button, functions
    ));
    solutionDestination.appendChild(containerTemplateCopy);
  }
}
