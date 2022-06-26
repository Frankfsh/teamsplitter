var $TABLE = $("#table");
var $BTN = $("#export-btn");
var $TEAM1 = $("#team1-list");
var $TEAM2 = $("#team2-list");

$(".table-add").click(function () {
  var $clone = $TABLE.find("tr.hide").clone(true).removeClass("hide");
  $TABLE.find("table").append($clone);
});

$(".table-remove").click(function () {
  $(this).parents("tr").detach();
});

$BTN.click(function () {
  const $rows = $TABLE.find("tr:not(:hidden)");
  const rows = Array.from($rows).slice(1);

  const arrayDetails = mapKeyValue(rows);

  console.log(arrayDetails);

  shuffleArray(arrayDetails);

  let { left, right, diff } = smartSplit(arrayDetails)
    ? smartSplit(arrayDetails)
    : {};
  console.log(left);
  console.log(right);
  console.log(diff);

  $TEAM1.empty();
  $TEAM2.empty();

  renderTable($TEAM1, left);
  renderTable($TEAM2, right);
});

const mapKeyValue = (htmlArray) =>
  htmlArray.map(function (row) {
    let tdrow = $(row).find("td");
    let iname = tdrow.children("input.name-input").val();
    let ilevel = tdrow.children("input.level-input").val();
    return { name: iname, level: ilevel };
  });

const levelSum = (kyArray) => kyArray.reduce((ps, x) => ps + +x.level, 0);
const levelMin = (kyArray) => Math.min(...kyArray.map((x) => +x.level));

function levelDiff(kyArray) {
  let sorted = kyArray.slice().sort((a, b) => a.level - b.level);
  let size = Math.round(kyArray.length / 2);
  let diffMax = levelSum(sorted.slice(size)) - levelSum(sorted.slice(0, size));
  return diffMax;
}

const renderTable = (tableSlot, arrayDetails) =>
  arrayDetails.forEach((x) =>
    tableSlot.append(`<li class="list-group-item">${x.name}</li>`)
  );

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function smartSplit(left, right = [], diff = 0) {
  let sumLeft = levelSum(left);
  let sumRight = levelSum(right);
  if ((sumLeft < sumRight) | (left.length < right.length)) {
    return;
  }

  if (sumLeft - sumRight == diff) {
    return { left, right, diff };
  }

  for (let i = left.length - 1; i > 0; i--) {
    let solution = smartSplit(
      left.slice(0, i).concat(left.slice(i + 1)),
      right.concat(left.at(i)),
      diff
    );
    if (solution) {
      return solution;
    }
  }

  if (right | (diff > 0)) {
    return;
  }

  let mdiff = levelDiff(left.concat(right));

  for (let tdiff = 1; tdiff < mdiff; tdiff++) {
    let solution = smartSplit(left, right, tdiff);
    if (solution) {
      return solution;
    }
  }
}
