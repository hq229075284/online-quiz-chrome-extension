function request(url, data) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("post", url);
    xhr.send(data);
    xhr.addEventListener("load", () => {
      const resposne = JSON.parse(xhr.responseText);
      resolve(resposne);
    });
  });
}

function fillAnswer(groups) {
  const questionDOMList = Array.from(
    document.querySelectorAll("uni-radio-group, uni-checkbox-group")
  );
  let index = 0;
  const chartList = ["A", "B", "C", "D", "E", "F"];
  groups.forEach((group, i) => {
    group.questions.forEach((q) => {
      const stdAnswer = q.question.stdAnswer.split("");
      stdAnswer.forEach((answer) => {
        questionDOMList[index].children[chartList.indexOf(answer)]
          .querySelector("uni-radio,uni-checkbox")
          .click();
      });
      index += 1;
    });
  });
}

async function autoAnswerCrack() {
  const matched = location.href.match(/planId=([^&]+)/);
  if (!matched) {
    alert("不是答题页");
    return;
  }

  const planId = matched[1];

  let formData;
  formData = new FormData();
  formData.append("planId", planId);
  let res;
  res = await request("/exam/exam-paper/start", formData);
  const id = res.bean.id;
  formData = new FormData();
  formData.append("id", id);
  res = await request("/exam/exam-paper/view", formData);
  fillAnswer(res.bean.groups);
  alert("已完成填写，请自行提交");
}

autoAnswerCrack();
