function autoAnswerCrack() {
  if (!document.body.dataset.answerid) {
    alert("不是答题页");
    return;
  }

  function fillAnswer(questions) {
    const questionDOMList = Array.from(document.querySelectorAll(".xuanxiang"));
    questions.forEach((question, i) => {
      const inputs = Array.from(
        questionDOMList[i].querySelectorAll("input[value]")
      );
      inputs.forEach((input) => {
        input.checked = question.answer.split("|").includes(input.value);
      });
    });
  }

  const xhr = new XMLHttpRequest();
  xhr.open(
    "post",
    "http://dati.mwr.gov.cn/sjsrzgszsflfgzs/handle/dt/loadRandomQuestion"
  );
  const { answerid, paperid } = document.body.dataset;
  const formData = new FormData();
  formData.append("answerId", answerid);
  formData.append("paperId", paperid);
  xhr.send(formData);
  xhr.addEventListener("load", () => {
    const resposne = JSON.parse(xhr.responseText);
    fillAnswer(resposne.result.questions);
    alert('已完成填写，请自行提交')
  });
}

autoAnswerCrack();
