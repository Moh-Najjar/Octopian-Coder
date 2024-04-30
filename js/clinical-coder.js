document.addEventListener("DOMContentLoaded", () => {
    loadScript(
        "https://code.jquery.com/jquery-3.7.0.js", function () {
            $("#clinical-code").append(GenerateContent);

            loadScript(
                "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js",
                function () {
                    isDataLoaded = true;
                }
            );
        }
    );
});


var isDataLoaded = false;
var dataLoadInterval;
var calbackResponse;
var APIKEY;

function loadScript(url, callback = function () { }) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}

function ChangeTheme(theme) {
    const { themeColor, textColor } = theme;

    if (theme && Object.keys(theme).length !== 0) {
        document.documentElement.style.setProperty('--Theme-background-color', themeColor);
        document.documentElement.style.setProperty('--Theme-text-color', textColor);
    }
    return false;
}

function GenerateClinicalCode(params) {
    if (!params.apiKey) {
        alert("No API Key Provided!");
    }
    else {
        if (!dataLoadInterval) {
            dataLoadInterval = setInterval(function () {
                if (isDataLoaded) {
                    APIKEY = params.apiKey;

                    ChangeTheme(params.theme);

                    recordingView();

                    $(".predict-btn").removeAttr("disabled");
                    clearInterval(dataLoadInterval);
                    dataLoadInterval = null;
                    if (typeof (params.calbackResponse) === "function") {
                        calbackResponse = params.calbackResponse;
                    }
                }
            }, 500);
        }
    }
}

//#region Generate Functions 

//#region GenerateContent
var GenerateContent =
    '<button class="btn btn-generate" type="button" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="Generate();">' +
    'Generate' +
    '</button>' +

    '<div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">' +

    '<div class="spinner-container" style="display:none">' +
    '<div class="spinner-border" role="status"></div>' +
    '</div>' +

    '<div class="offcanvas-header">' +
    '<h5 class="offcanvas-title" id="offcanvasBottomLabel">Clinical Coder</h5>' +
    '<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>' +
    '</div>' +
    '<div class="offcanvas-body">' +

    '<div class="flex-content">' +

    //1st Space
    '<div class="recording">' +
    '<div class="recording-header">' +
    '<h5>Recording</h5>' +
    '</div>' +
    '<div class="recording-body">' +
    '<div class="recording-btn">' +
    '</div>' +
    '<audio id="recordedAudio" controls></audio>' +

    //'<pre>Press here to start recording</pre>'+
    '<div class="mic" onClick="startRecording()"></div>' +
    '<div class="mic-stop" onClick="stopRecording()"></div>' +

    '</div>' +
    '</div>' +
    //2nd Space
    '<div class="medical-record">' +
    '<div class="medical-record-header">' +
    '<h5>Medical Record</h5>' +
    '</div>' +
    '<div class="medical-record-body">' +

    '<pre id="medicalRecord" contenteditable="true">' +
    'There is no medical record yet.' +
    '</pre>' +

    '</div>' +
    '<div class="generate-btn">' +
    '<button onClick="generateMedicalRecordByText()">Generate</button>' +
    '</div>' +
    '</div>' +
    //3nd Space
    '<div class="coding">' +
    '<div class="coding-header">' +
    '<nav>' +
    '<div class="nav nav-tabs" id="nav-tab" role="tablist">' +
    '<button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true" onclick="OnTabSwitch()">' +
    'Certain' +
    '</button>' +
    '<button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false" onclick="OnTabSwitch()">' +
    'Probable' +
    '</button>' +
    '</div>' +
    '</nav>' +
    '</div>' +
    '<div class="coding-body">' +
    '<div class="tab-content" id="nav-tabContent">' +
    '<div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">' +

    //< !--Accordion Certain-->
    '<div class="accordion">' +
    '<div class="accordion-item" id="CertainAccordion">' +
    '<pre>' +
    'There is no data.' +
    '</pre>' +
    '</div>' +
    '</div>' +
    //< !--End Accordion-->

    '</div>' +
    '<div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">' +

    //< !--Accordion Probable-->
    '<div class="accordion">' +
    '<div class="accordion-item" id="ProbableAccordion">' +
    '<pre>' +
    'There is no data.' +
    '</pre>' +
    '</div>' +
    '</div>' +
    //< !--End Accordion-->

    '</div>' +
    '</div>' +
    '</div>' +
    //-----------------Modal Button--------------------
    '<button type="button" class="btn-code predict-btn" onclick="PredictClinical()" data-bs-target="#cliniclCoderModal" disabled>' +
    'Code' +
    '</button>' +
    //-----------------End Modal Button--------------------
    '</div>' +
    '</div>' +
    '</div>' +

    //-----------------Modal--------------------
    '<div id="selected-code-recommendation-container" class="mainList" style="display:none">' +
    '<div class="list-group-header">' +
    '<h5>Selected Code Recommendation</h5>' +
    '</div>' +
    '<div id="mainSelectedItems">' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="modal fade" id="cliniclCoderModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">' +
    '<div class="modal-content">' +
    '<div class="modal-body">' +
    '<div class="list">' +
    '<div class="list-group-header">' +
    '<h5>Recommendation Codes</h5>' +
    '</div>' +
    '<ul class="list-group" id="PredictClinicalDTOsDataSource">' +
    '</ul>' +
    '</div>' +
    '<div class="list">' +
    '<div class="list-group-header">' +
    '<h5>Selected Codes</h5>' +
    '</div>' +
    '<div id="selectedItems"></div>' +
    '</div>' +
    '</div>' +
    '<div class="modal-footer">' +
    '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>' +
    '<button type="button" id="save-btn" class="btn btn-primary save-btn" onclick="SelectClinicalCode()">Done</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    //-----------------End Modal--------------------
    '</div>';

//#endregion


var Analyze;
function Generate() {
    $('.offcanvas').offcanvas('toggle');
}

function generateMedicalRecordByVoice(MedicalRecord) {
    $("#medicalRecord").html(MedicalRecord);
}

function generateMedicalRecordByText() {
    var MedicalRecord = $("#medicalRecord")[0].innerText;

    var Url = "https://octopiandevcoreapim.azure-api.net/AI/ClinicalCoding";
    var Data = '{"ClinicalCodingType":11,"TextRsecord":"' + MedicalRecord + '"}';

    ShowLoader();

    fetch(Url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': APIKEY
        },
        body: Data
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            HideLoader();
            Analyze = JSON.parse(json.Analyze);
            var Probable = JSON.parse(json.Probable);
            var Certain = JSON.parse(json.Certain);

            DisplayCertainItem(Certain);
            DisplayProbableItem(Probable);
        })
        .catch(error => {
            console.log(error);
            var ErrorMessage = error.responseJSON.message;
            HideLoader();
            alert(ErrorMessage)
            $('.offcanvas').offcanvas('toggle');
        });
}

function GenerateJSON(json) {
    //console.log(json)

    var newJson = [];
    $.each(json, function (i) {
        var GroupObject = {};

        var Group = json[i];
        var GroupName = Group.GroupName;
        GroupObject["GroupName"] = GroupName;
        var TextAnalysisModel = Group.TextAnalysisModel;

        var ContentDetails = [];
        $.each(TextAnalysisModel, function (j) {
            var ContentDetailsObject = {};
            var EntityMentionContent = TextAnalysisModel[j].entityMention.text.content;
            ContentDetailsObject["EntityMentionContent"] = EntityMentionContent;

            var CertaintyAssessment = TextAnalysisModel[j].entityMention.certaintyAssessment ? TextAnalysisModel[j].entityMention.certaintyAssessment.value : null
            ContentDetailsObject["CertaintyAssessment"] = CertaintyAssessment ? CertaintyAssessment : "";

            var TemporalAssessment = TextAnalysisModel[j].entityMention.temporalAssessment ? TextAnalysisModel[j].entityMention.temporalAssessment.value : null;
            ContentDetailsObject["TemporalAssessment"] = TemporalAssessment ? TemporalAssessment : "";

            ContentDetailsObject["EntityMentionValue"] = CertaintyAssessment && TemporalAssessment ? CertaintyAssessment + "," + TemporalAssessment : "";


            var Confidence = TextAnalysisModel[j].entityMention.confidence;
            ContentDetailsObject["Confidence"] = Confidence;

            var entityRelationshipList = TextAnalysisModel[j].entityRelationshipList;
            $.each(entityRelationshipList, function (h) {
                var RelationshipContent = entityRelationshipList[h].text.content;
                ContentDetailsObject["RelationshipContent"] = RelationshipContent;

            });
            ContentDetails.push(ContentDetailsObject);
        });

        GroupObject["ContentDetails"] = ContentDetails;

        newJson.push(GroupObject);
    });

    //console.log(newJson)

    return newJson;


}

const DisplayCertainItem = async (CertainJSON) => {

    var newJson = await GenerateJSON(CertainJSON);

    if (newJson.length > 0) {
        const accordionContent = newJson.map((item) => {

            const accordionHeader = item.ContentDetails.map((subItem) => {
                const {
                    EntityMentionContent = "",
                    EntityMentionValue = "",
                    RelationshipContent = "",
                    Confidence = "",
                    CertaintyAssessment = "",
                    TemporalAssessment = "",
                } = subItem;

                //const nextEntityMentionValue = EntityMentionValue ? ' (' + EntityMentionValue + ')' : "";
                const nextEntityMentionValue = CertaintyAssessment && TemporalAssessment ? '(' + CertaintyAssessment + ' , ' + TemporalAssessment + ')' : "";

                const id = GenerateRandomId();

                return ('<div id="' + RemoveSpaces(item.GroupName) + '" class="accordion-collapse collapse hide" aria-labelledby="panelsStayOpen-headingOne">' +
                    '<div class="accordion-body ' + id + '" onClick="ToggleCheckbox(this)">' +


                    '<input class="form-check-input me-1" type="checkbox" id="' + id + '" confidence="' + Confidence + '" entityMentionContent="' + EntityMentionContent + '" entityMentionValue="' + EntityMentionValue + '" relationshipContent="' + RelationshipContent + '" onchange="OnSelectItem(this)" style="display:none"/>' +


                    '<p class="likely-color">' + CapitalizeFirstLetter(EntityMentionContent) + ' ' + nextEntityMentionValue + '</p>' +
                    '<p>' + CapitalizeFirstLetter(RelationshipContent) + '</p>' +
                    '<p class="code">' +
                    '<code>' + Confidence + '</code >' +
                    '</p > ' +
                    '</div>' +
                    '</div>');
            });

            return ('<h2 class="accordion-header" id="panelsStayOpen-headingOne">' +
                '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' + RemoveSpaces(item.GroupName) + '" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">' +
                item.GroupName +
                '</button>' +
                '</h2>' + accordionHeader.join(" "));
        });

        $("#CertainAccordion").html(accordionContent.join(" "));
    }
    else {
        $("#CertainAccordion").html('<pre>There is no certain data.</pre>');
    }


}

const DisplayProbableItem = async (ProbableJSON) => {
    var newJson = await GenerateJSON(ProbableJSON);

    if (newJson.length > 0) {
        const accordionContent = newJson.map((item) => {
            const groupNameId = "C" + GenerateRandomId();

            const accordionHeader = item.ContentDetails.map((subItem) => {
                const {
                    EntityMentionContent = "",
                    EntityMentionValue = "",
                    RelationshipContent = "",
                    Confidence = ""
                } = subItem;

                const nextEntityMentionValue = EntityMentionValue ? ' (' + EntityMentionValue + ')' : "";
                const id = GenerateRandomId();

                return ('<div id="' + groupNameId + '" class="accordion-collapse collapse hide" aria-labelledby="panelsStayOpen-headingOne">' +
                    '<div class="accordion-body ' + id + '" onClick="ToggleCheckbox(this)">' +


                    '<input class="form-check-input me-1" type="checkbox" id="' + id + '" confidence="' + Confidence + '" entityMentionContent="' + EntityMentionContent + '" entityMentionValue="' + EntityMentionValue + '" relationshipContent="' + RelationshipContent + '" onchange="OnSelectItem(this)" style="display:none"/>' +


                    '<p>' + CapitalizeFirstLetter(EntityMentionContent) + ' ' + nextEntityMentionValue + '</p>' +
                    '<p>' + CapitalizeFirstLetter(RelationshipContent) + '</p>' +
                    '<p class="code">' +
                    '<code>' + Confidence + '</code >' +
                    '</p > ' +
                    '</div>' +
                    '</div>');
            });


            return ('<h2 class="accordion-header" id="panelsStayOpen-headingOne">' +
                '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' + groupNameId + '" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">' +
                item.GroupName +
                '</button>' +
                '</h2>' + accordionHeader.join(" "));
        });

        $("#ProbableAccordion").html(accordionContent.join(" "));
    } else {
        $("#ProbableAccordion").html('<pre>There is no probable data.</pre>');
    }
}

function RemoveSpaces(inputString) {
    return inputString.replace(/\s/g, '');
}

var SelectedItemArray = [];
var HighlightedArray = [];
function OnSelectItem(selector) {
    HighlightedArray = [];

    var isChecked = $(selector).prop('checked');
    var id = $(selector).attr("id");
    var confidence = $(selector).attr("confidence");
    var entityMentionContent = $(selector).attr("entityMentionContent");
    var entityMentionValue = $(selector).attr("entityMentionValue");
    var relationshipContent = $(selector).attr("relationshipContent");

    if (isChecked) {
        SelectedItemArray.push({
            Id: id,
            Confidence: confidence,
            EntityMentionContent: entityMentionContent,
            EntityMentionValue: entityMentionValue,
            RelationshipContent: relationshipContent,
        })
        $("." + id).addClass("isSelected");


        HighlightedArray.push(entityMentionContent ? entityMentionContent : "#@$", relationshipContent ? relationshipContent : "@#$");

        HighlightTexts(HighlightedArray);


    } else {
        var indexToRemove = SelectedItemArray.findIndex(item => item.Id === id && item.Confidence === confidence && item.EntityMentionContent === entityMentionContent && item.EntityMentionValue === entityMentionValue && item.RelationshipContent === relationshipContent);

        if (indexToRemove !== -1) {
            SelectedItemArray.splice(indexToRemove, 1);
        }
        $("." + id).removeClass("isSelected")

        HighlightedArray.push(entityMentionContent ? entityMentionContent : "#@$", relationshipContent ? relationshipContent : "@#$");
        RemoveHighlightTexts(HighlightedArray);
    }
    //console.log(SelectedItemArray);
}

function OnTabSwitch() {
    SelectedItemArray = [];

    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
        $(".accordion-body").removeClass("isSelected");
    });

    var preElement = document.getElementById('medicalRecord');
    preElement.innerHTML = preElement.innerHTML.replace(/<span style="background-color: yellow;">(.*?)<\/span>/g, '$1');

}

function ConvertLikelyColor(text) {

    //console.log(text)
    var modifiedName = text.replace(/LIKELY/gi, '<span style="color:#00f100">LIKELY</span>');
    return (modifiedName);
}

function ToggleCheckbox(divElement) {
    var checkbox = divElement.querySelector('input[type="checkbox"]');

    checkbox.checked = !checkbox.checked;

    checkbox.dispatchEvent(new Event('change'));
}

function CapitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function GenerateRandomId() {
    const min = Math.pow(10, 14); // Minimum 15-digit number
    const max = Math.pow(10, 15) - 1; // Maximum 15-digit number

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function HighlightTexts(searchTexts) {
    var preElement = document.getElementById('medicalRecord');
    var text = preElement.innerHTML;

    searchTexts.forEach(function (searchText) {
        text = text.replace(new RegExp(searchText, 'g'), '<span style="background-color: yellow;">$&</span>');
        preElement.innerHTML = text;
    });

}

function RemoveHighlightTexts(searchTexts) {
    var preElement = document.getElementById('medicalRecord');
    var text = preElement.innerHTML;

    searchTexts.forEach(function (searchText) {
        text = text.replace(new RegExp(searchText, 'g'), '<span style="background-color: #fff;">$&</span>');
    });

    preElement.innerHTML = text;
}

function ShowLoader() {
    $(".spinner-container").show();
}

function HideLoader() {
    $(".spinner-container").hide()
}

//#endregion

//#region Coder Functions

var SelectedItemDTOs = [];

function PredictClinical() {
    SelectedItemDTOs = [];
    DisplaySelectedItems([]);
    PredictClinicalDTOsDataSource = " ";

    $("#cliniclCoderModal").modal("toggle");
    var Result = Analyze;

    var uniqueIds = [];
    var uniqueArray = Result.filter((i) => {
        var isDuplicated = uniqueIds.includes(i.Code);
        return !isDuplicated && uniqueIds.push(i.Code);
    });

    PredictClinicalDTOsDataSource = uniqueArray.map((item, index) => {
        return '<li class="list-group-item">' +
            '<div>' +
            '<input class="form-check-input me-1" type="checkbox" id="' + item.Code + '" code="' + item.Code + '" itemName="' + item.Name + '" CodeType="' + item.CodeType + '"  onchange="Check(this)">' +
            '<label class="form-check-label stretched-link code" for="' + item.Code + '">' + item.Code + '</label>' +
            '<label class="form-check-label stretched-link name" for="' + item.Code + '">' + item.Name + '</label>' +
            '</div>' +
            '<div class="code-type">' + item.CodeType + '</div>' +
            '</li>';
    });
    $("#PredictClinicalDTOsDataSource").html(PredictClinicalDTOsDataSource);
}

function Check(selector) {
    var isChecked = $(selector).prop('checked');
    var code = $(selector).attr("id");
    var codeType = $(selector).attr("codetype");
    var name = $(selector).attr("itemname");

    if (isChecked) {
        SelectedItemDTOs.push({
            Code: code,
            CodeType: codeType,
            Name: name
        })
    } else {
        SelectedItemDTOs = SelectedItemDTOs.filter(item => item.Code !== code);
    }
    DisplaySelectedItems(SelectedItemDTOs);
}

function DisplaySelectedItems(selectedItems) {
    var content = "";
    if (selectedItems.length === 0) {
        content = '<p style="text-align: center;margin-top: 2rem;">No data selected yet.</p>';
    } else {
        selectedItems.map((item, index) => {
            content += '<div class="border" style="padding: 10px;height: 5rem;background-color: #5683b61a;">' +
                '<div class="item-name">' +
                '<i class="fa-solid fa-circle-check" style="color: #04118f;font-size: 1.5rem;"></i>' +
                '<p>' + item.Code + '</p>' +
                '<p>' + item.Name + '</p>' +
                '</div>' +
                '<div class="item-idc">' +
                '<p>' + item.CodeType + '</p>' +
                '</div>' +
                '</div>';
        });
    }

    $("#selectedItems").html(content);
}

function SelectClinicalCode() {
    $("#cliniclCoderModal").modal("toggle");
    //$('.offcanvas').offcanvas('toggle');

    calbackResponse(SelectedItemDTOs);
}

//#endregion

//#region Recording
let mediaRecorder;
let chunks = [];
var startRecordingButton;
var stopRecordingButton;
function recordingView() {
    //startRecordingButton = document.getElementById('startRecording');
    //stopRecordingButton = document.getElementById('stopRecording');
    recordedAudio = document.getElementById('recordedAudio');

    //startRecordingButton.addEventListener('click', startRecording);
    //stopRecordingButton.addEventListener('click', stopRecording);
}

//#region recorder.min 
!function (e, t) { "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.Recorder = t() : e.Recorder = t() }("undefined" != typeof self ? self : this, (function () { return function (e) { var t = {}; function o(n) { if (t[n]) return t[n].exports; var i = t[n] = { i: n, l: !1, exports: {} }; return e[n].call(i.exports, i, i.exports, o), i.l = !0, i.exports } return o.m = e, o.c = t, o.d = function (e, t, n) { o.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n }) }, o.r = function (e) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }) }, o.t = function (e, t) { if (1 & t && (e = o(e)), 8 & t) return e; if (4 & t && "object" == typeof e && e && e.__esModule) return e; var n = Object.create(null); if (o.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e) for (var i in e) o.d(n, i, function (t) { return e[t] }.bind(null, i)); return n }, o.n = function (e) { var t = e && e.__esModule ? function () { return e.default } : function () { return e }; return o.d(t, "a", t), t }, o.o = function (e, t) { return Object.prototype.hasOwnProperty.call(e, t) }, o.p = "", o(o.s = 0) }([function (e, t, o) { "use strict"; (function (t) { function o(e, t) { if (null == e) return {}; var o, n, i = function (e, t) { if (null == e) return {}; var o, n, i = {}, r = Object.keys(e); for (n = 0; n < r.length; n++)o = r[n], t.indexOf(o) >= 0 || (i[o] = e[o]); return i }(e, t); if (Object.getOwnPropertySymbols) { var r = Object.getOwnPropertySymbols(e); for (n = 0; n < r.length; n++)o = r[n], t.indexOf(o) >= 0 || Object.prototype.propertyIsEnumerable.call(e, o) && (i[o] = e[o]) } return i } var n = t.AudioContext || t.webkitAudioContext, i = function e() { var t = this, o = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; if (!e.isRecordingSupported()) throw new Error("Recording is not supported in this browser"); this.state = "inactive", this.config = Object.assign({ bufferLength: 4096, encoderApplication: 2049, encoderFrameSize: 20, encoderPath: "encoderWorker.min.js", encoderSampleRate: 48e3, maxFramesPerPage: 40, mediaTrackConstraints: !0, monitorGain: 0, numberOfChannels: 1, recordingGain: 1, resampleQuality: 3, streamPages: !1, wavBitDepth: 16, sourceNode: { context: null } }, o), this.encodedSamplePosition = 0, this.initAudioContext(), this.initialize = this.initWorklet().then((function () { return t.initEncoder() })) }; i.isRecordingSupported = function () { var e = t.navigator && t.navigator.mediaDevices && t.navigator.mediaDevices.getUserMedia; return n && e && t.WebAssembly }, i.version = "8.0.5", i.prototype.clearStream = function () { this.stream && (this.stream.getTracks ? this.stream.getTracks().forEach((function (e) { return e.stop() })) : this.stream.stop()) }, i.prototype.close = function () { return this.monitorGainNode.disconnect(), this.recordingGainNode.disconnect(), this.sourceNode && this.sourceNode.disconnect(), this.clearStream(), this.encoder && (this.encoderNode.disconnect(), this.encoder.postMessage({ command: "close" })), this.config.sourceNode.context ? Promise.resolve() : this.audioContext.close() }, i.prototype.encodeBuffers = function (e) { if ("recording" === this.state) { for (var t = [], o = 0; o < e.numberOfChannels; o++)t[o] = e.getChannelData(o); this.encoder.postMessage({ command: "encode", buffers: t }) } }, i.prototype.initAudioContext = function () { this.audioContext = this.config.sourceNode.context ? this.config.sourceNode.context : new n, this.monitorGainNode = this.audioContext.createGain(), this.setMonitorGain(this.config.monitorGain), this.recordingGainNode = this.audioContext.createGain(), this.setRecordingGain(this.config.recordingGain) }, i.prototype.initEncoder = function () { var e = this; this.audioContext.audioWorklet ? (this.encoderNode = new AudioWorkletNode(this.audioContext, "encoder-worklet", { numberOfOutputs: 0 }), this.encoder = this.encoderNode.port) : (console.log("audioWorklet support not detected. Falling back to scriptProcessor"), this.encodeBuffers = function () { return delete e.encodeBuffers }, this.encoderNode = this.audioContext.createScriptProcessor(this.config.bufferLength, this.config.numberOfChannels, this.config.numberOfChannels), this.encoderNode.onaudioprocess = function (t) { var o = t.inputBuffer; return e.encodeBuffers(o) }, this.encoderNode.connect(this.audioContext.destination), this.encoder = new t.Worker(this.config.encoderPath)) }, i.prototype.initSourceNode = function () { var e = this; return this.config.sourceNode.context ? (this.sourceNode = this.config.sourceNode, Promise.resolve()) : t.navigator.mediaDevices.getUserMedia({ audio: this.config.mediaTrackConstraints }).then((function (t) { e.stream = t, e.sourceNode = e.audioContext.createMediaStreamSource(t) })) }, i.prototype.initWorker = function () { var e = this, t = (this.config.streamPages ? this.streamPage : this.storePage).bind(this); return this.recordedPages = [], this.totalLength = 0, new Promise((function (n) { e.encoder.addEventListener("message", (function o(i) { var r = i.data; switch (r.message) { case "ready": n(); break; case "page": e.encodedSamplePosition = r.samplePosition, t(r.page); break; case "done": e.encoder.removeEventListener("message", o), e.finish() } })), e.encoder.start && e.encoder.start(); var i = e.config, r = (i.sourceNode, o(i, ["sourceNode"])); e.encoder.postMessage(Object.assign({ command: "init", originalSampleRate: e.audioContext.sampleRate, wavSampleRate: e.audioContext.sampleRate }, r)) })) }, i.prototype.initWorklet = function () { return this.audioContext.audioWorklet ? this.audioContext.audioWorklet.addModule(this.config.encoderPath) : Promise.resolve() }, i.prototype.pause = function (e) { var t = this; if ("recording" === this.state) return this.state = "paused", this.recordingGainNode.disconnect(), e && this.config.streamPages ? new Promise((function (e) { t.encoder.addEventListener("message", (function o(n) { "flushed" === n.data.message && (t.encoder.removeEventListener("message", o), t.onpause(), e()) })), t.encoder.start && t.encoder.start(), t.encoder.postMessage({ command: "flush" }) })) : (this.onpause(), Promise.resolve()) }, i.prototype.resume = function () { "paused" === this.state && (this.state = "recording", this.recordingGainNode.connect(this.encoderNode), this.onresume()) }, i.prototype.setRecordingGain = function (e) { this.config.recordingGain = e, this.recordingGainNode && this.audioContext && this.recordingGainNode.gain.setTargetAtTime(e, this.audioContext.currentTime, .01) }, i.prototype.setMonitorGain = function (e) { this.config.monitorGain = e, this.monitorGainNode && this.audioContext && this.monitorGainNode.gain.setTargetAtTime(e, this.audioContext.currentTime, .01) }, i.prototype.start = function () { var e = this; return "inactive" === this.state ? (this.state = "loading", this.encodedSamplePosition = 0, this.audioContext.resume().then((function () { return e.initialize })).then((function () { return Promise.all([e.initSourceNode(), e.initWorker()]) })).then((function () { e.state = "recording", e.encoder.postMessage({ command: "getHeaderPages" }), e.sourceNode.connect(e.monitorGainNode), e.sourceNode.connect(e.recordingGainNode), e.monitorGainNode.connect(e.audioContext.destination), e.recordingGainNode.connect(e.encoderNode), e.onstart() })).catch((function (t) { throw e.state = "inactive", t }))) : Promise.resolve() }, i.prototype.stop = function () { var e = this; return "paused" === this.state || "recording" === this.state ? (this.state = "inactive", this.recordingGainNode.connect(this.encoderNode), this.monitorGainNode.disconnect(), this.clearStream(), new Promise((function (t) { e.encoder.addEventListener("message", (function o(n) { "done" === n.data.message && (e.encoder.removeEventListener("message", o), t()) })), e.encoder.start && e.encoder.start(), e.encoder.postMessage({ command: "done" }) }))) : Promise.resolve() }, i.prototype.storePage = function (e) { this.recordedPages.push(e), this.totalLength += e.length }, i.prototype.streamPage = function (e) { this.ondataavailable(e) }, i.prototype.finish = function () { if (!this.config.streamPages) { var e = new Uint8Array(this.totalLength); this.recordedPages.reduce((function (t, o) { return e.set(o, t), t + o.length }), 0), this.ondataavailable(e) } this.onstop() }, i.prototype.ondataavailable = function () { }, i.prototype.onpause = function () { }, i.prototype.onresume = function () { }, i.prototype.onstart = function () { }, i.prototype.onstop = function () { }, e.exports = i }).call(this, o(1)) }, function (e, t) { var o; o = function () { return this }(); try { o = o || new Function("return this")() } catch (e) { "object" == typeof window && (o = window) } e.exports = o }]) }));
//#endregion

if (!Recorder.isRecordingSupported()) {
    screenLogger("Recording features are not supported in your browser.");
}

else {
    var recorder = new Recorder({
        monitorGain: parseInt(0, 10),
        recordingGain: parseInt(1, 10),
        numberOfChannels: parseInt(1, 10),
        wavBitDepth: parseInt(16, 10),
        encoderPath: "data:text/javascript;base64,IWZ1bmN0aW9uKGUsdCl7aWYoIm9iamVjdCI9PXR5cGVvZiBleHBvcnRzJiYib2JqZWN0Ij09dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz10KCk7ZWxzZSBpZigiZnVuY3Rpb24iPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSx0KTtlbHNle3ZhciByPXQoKTtmb3IodmFyIG4gaW4gcikoIm9iamVjdCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHM6ZSlbbl09cltuXX19KCJ1bmRlZmluZWQiIT10eXBlb2Ygc2VsZj9zZWxmOnRoaXMsKGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciB0PXt9O2Z1bmN0aW9uIHIobil7aWYodFtuXSlyZXR1cm4gdFtuXS5leHBvcnRzO3ZhciBvPXRbbl09e2k6bixsOiExLGV4cG9ydHM6e319O3JldHVybiBlW25dLmNhbGwoby5leHBvcnRzLG8sby5leHBvcnRzLHIpLG8ubD0hMCxvLmV4cG9ydHN9cmV0dXJuIHIubT1lLHIuYz10LHIuZD1mdW5jdGlvbihlLHQsbil7ci5vKGUsdCl8fE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLHQse2VudW1lcmFibGU6ITAsZ2V0Om59KX0sci5yPWZ1bmN0aW9uKGUpeyJ1bmRlZmluZWQiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6Ik1vZHVsZSJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwiX19lc01vZHVsZSIse3ZhbHVlOiEwfSl9LHIudD1mdW5jdGlvbihlLHQpe2lmKDEmdCYmKGU9cihlKSksOCZ0KXJldHVybiBlO2lmKDQmdCYmIm9iamVjdCI9PXR5cGVvZiBlJiZlJiZlLl9fZXNNb2R1bGUpcmV0dXJuIGU7dmFyIG49T2JqZWN0LmNyZWF0ZShudWxsKTtpZihyLnIobiksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sImRlZmF1bHQiLHtlbnVtZXJhYmxlOiEwLHZhbHVlOmV9KSwyJnQmJiJzdHJpbmciIT10eXBlb2YgZSlmb3IodmFyIG8gaW4gZSlyLmQobixvLGZ1bmN0aW9uKHQpe3JldHVybiBlW3RdfS5iaW5kKG51bGwsbykpO3JldHVybiBufSxyLm49ZnVuY3Rpb24oZSl7dmFyIHQ9ZSYmZS5fX2VzTW9kdWxlP2Z1bmN0aW9uKCl7cmV0dXJuIGUuZGVmYXVsdH06ZnVuY3Rpb24oKXtyZXR1cm4gZX07cmV0dXJuIHIuZCh0LCJhIix0KSx0fSxyLm89ZnVuY3Rpb24oZSx0KXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGUsdCl9LHIucD0iIixyKHIucz0wKX0oW2Z1bmN0aW9uKGUsdCxyKXsidXNlIHN0cmljdCI7ZnVuY3Rpb24gbihlKXtyZXR1cm4obj0iZnVuY3Rpb24iPT10eXBlb2YgU3ltYm9sJiYic3ltYm9sIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbihlKXtyZXR1cm4gdHlwZW9mIGV9OmZ1bmN0aW9uKGUpe3JldHVybiBlJiYiZnVuY3Rpb24iPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT8ic3ltYm9sIjp0eXBlb2YgZX0pKGUpfWZ1bmN0aW9uIG8oZSx0KXtmb3IodmFyIHI9MDtyPHQubGVuZ3RoO3IrKyl7dmFyIG49dFtyXTtuLmVudW1lcmFibGU9bi5lbnVtZXJhYmxlfHwhMSxuLmNvbmZpZ3VyYWJsZT0hMCwidmFsdWUiaW4gbiYmKG4ud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLG4ua2V5LG4pfX1mdW5jdGlvbiBzKGUsdCl7cmV0dXJuIXR8fCJvYmplY3QiIT09bih0KSYmImZ1bmN0aW9uIiE9dHlwZW9mIHQ/ZnVuY3Rpb24oZSl7aWYodm9pZCAwPT09ZSl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZCIpO3JldHVybiBlfShlKTp0fWZ1bmN0aW9uIGkoZSl7dmFyIHQ9ImZ1bmN0aW9uIj09dHlwZW9mIE1hcD9uZXcgTWFwOnZvaWQgMDtyZXR1cm4oaT1mdW5jdGlvbihlKXtpZihudWxsPT09ZXx8KHI9ZSwtMT09PUZ1bmN0aW9uLnRvU3RyaW5nLmNhbGwocikuaW5kZXhPZigiW25hdGl2ZSBjb2RlXSIpKSlyZXR1cm4gZTt2YXIgcjtpZigiZnVuY3Rpb24iIT10eXBlb2YgZSl0aHJvdyBuZXcgVHlwZUVycm9yKCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiIpO2lmKHZvaWQgMCE9PXQpe2lmKHQuaGFzKGUpKXJldHVybiB0LmdldChlKTt0LnNldChlLG4pfWZ1bmN0aW9uIG4oKXtyZXR1cm4gYShlLGFyZ3VtZW50cyxmKHRoaXMpLmNvbnN0cnVjdG9yKX1yZXR1cm4gbi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlLnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOm4sZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksYyhuLGUpfSkoZSl9ZnVuY3Rpb24gYShlLHQscil7cmV0dXJuKGE9dSgpP1JlZmxlY3QuY29uc3RydWN0OmZ1bmN0aW9uKGUsdCxyKXt2YXIgbj1bbnVsbF07bi5wdXNoLmFwcGx5KG4sdCk7dmFyIG89bmV3KEZ1bmN0aW9uLmJpbmQuYXBwbHkoZSxuKSk7cmV0dXJuIHImJmMobyxyLnByb3RvdHlwZSksb30pLmFwcGx5KG51bGwsYXJndW1lbnRzKX1mdW5jdGlvbiB1KCl7aWYoInVuZGVmaW5lZCI9PXR5cGVvZiBSZWZsZWN0fHwhUmVmbGVjdC5jb25zdHJ1Y3QpcmV0dXJuITE7aWYoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSlyZXR1cm4hMTtpZigiZnVuY3Rpb24iPT10eXBlb2YgUHJveHkpcmV0dXJuITA7dHJ5e3JldHVybiBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsW10sKGZ1bmN0aW9uKCl7fSkpKSwhMH1jYXRjaChlKXtyZXR1cm4hMX19ZnVuY3Rpb24gYyhlLHQpe3JldHVybihjPU9iamVjdC5zZXRQcm90b3R5cGVPZnx8ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5fX3Byb3RvX189dCxlfSkoZSx0KX1mdW5jdGlvbiBmKGUpe3JldHVybihmPU9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3QuZ2V0UHJvdG90eXBlT2Y6ZnVuY3Rpb24oZSl7cmV0dXJuIGUuX19wcm90b19ffHxPYmplY3QuZ2V0UHJvdG90eXBlT2YoZSl9KShlKX12YXIgbD1mdW5jdGlvbihlKXtpZighKGU9T2JqZWN0LmFzc2lnbih7d2F2Qml0RGVwdGg6MTYsbnVtYmVyT2ZDaGFubmVsczoxfSxlKSkud2F2U2FtcGxlUmF0ZSl0aHJvdyBuZXcgRXJyb3IoIndhdlNhbXBsZVJhdGUgdmFsdWUgaXMgcmVxdWlyZWQgdG8gcmVjb3JkLiBOT1RFOiBBdWRpbyBpcyBub3QgcmVzYW1wbGVkISIpO2lmKC0xPT09WzgsMTYsMjQsMzJdLmluZGV4T2YoZS53YXZCaXREZXB0aCkpdGhyb3cgbmV3IEVycm9yKCJPbmx5IDgsIDE2LCAyNCBhbmQgMzIgYml0cyBwZXIgc2FtcGxlIGFyZSBzdXBwb3J0ZWQiKTt0aGlzLm51bWJlck9mQ2hhbm5lbHM9ZS5udW1iZXJPZkNoYW5uZWxzLHRoaXMuYml0RGVwdGg9ZS53YXZCaXREZXB0aCx0aGlzLnNhbXBsZVJhdGU9ZS53YXZTYW1wbGVSYXRlLHRoaXMucmVjb3JkZWRCdWZmZXJzPVtdLHRoaXMuYnl0ZXNQZXJTYW1wbGU9dGhpcy5iaXREZXB0aC84fTtpZihsLnByb3RvdHlwZS5yZWNvcmQ9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PWVbMF0ubGVuZ3RoLHI9bmV3IFVpbnQ4QXJyYXkodCp0aGlzLm51bWJlck9mQ2hhbm5lbHMqdGhpcy5ieXRlc1BlclNhbXBsZSksbj0wO248dDtuKyspZm9yKHZhciBvPTA7bzx0aGlzLm51bWJlck9mQ2hhbm5lbHM7bysrKXt2YXIgcz0obip0aGlzLm51bWJlck9mQ2hhbm5lbHMrbykqdGhpcy5ieXRlc1BlclNhbXBsZSxpPU1hdGgubWF4KC0xLE1hdGgubWluKDEsZVtvXVtuXSkpO3N3aXRjaCh0aGlzLmJ5dGVzUGVyU2FtcGxlKXtjYXNlIDQ6aT0yMTQ3NDgzNjQ3LjUqaS0uNSxyW3NdPWkscltzKzFdPWk+PjgscltzKzJdPWk+PjE2LHJbcyszXT1pPj4yNDticmVhaztjYXNlIDM6aT04Mzg4NjA3LjUqaS0uNSxyW3NdPWkscltzKzFdPWk+PjgscltzKzJdPWk+PjE2O2JyZWFrO2Nhc2UgMjppPTMyNzY3LjUqaS0uNSxyW3NdPWkscltzKzFdPWk+Pjg7YnJlYWs7Y2FzZSAxOnJbc109MTI3LjUqKGkrMSk7YnJlYWs7ZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoIk9ubHkgOCwgMTYsIDI0IGFuZCAzMiBiaXRzIHBlciBzYW1wbGUgYXJlIHN1cHBvcnRlZCIpfX10aGlzLnJlY29yZGVkQnVmZmVycy5wdXNoKHIpfSxsLnByb3RvdHlwZS5yZXF1ZXN0RGF0YT1mdW5jdGlvbigpe3ZhciBlPXRoaXMucmVjb3JkZWRCdWZmZXJzWzBdLmxlbmd0aCx0PXRoaXMucmVjb3JkZWRCdWZmZXJzLmxlbmd0aCplLHI9bmV3IFVpbnQ4QXJyYXkoNDQrdCksbj1uZXcgRGF0YVZpZXcoci5idWZmZXIpO24uc2V0VWludDMyKDAsMTM4MDUzMzgzMCwhMSksbi5zZXRVaW50MzIoNCwzNit0LCEwKSxuLnNldFVpbnQzMig4LDE0NjM4OTk3MTcsITEpLG4uc2V0VWludDMyKDEyLDE3MTg0NDkxODQsITEpLG4uc2V0VWludDMyKDE2LDE2LCEwKSxuLnNldFVpbnQxNigyMCwxLCEwKSxuLnNldFVpbnQxNigyMix0aGlzLm51bWJlck9mQ2hhbm5lbHMsITApLG4uc2V0VWludDMyKDI0LHRoaXMuc2FtcGxlUmF0ZSwhMCksbi5zZXRVaW50MzIoMjgsdGhpcy5zYW1wbGVSYXRlKnRoaXMuYnl0ZXNQZXJTYW1wbGUqdGhpcy5udW1iZXJPZkNoYW5uZWxzLCEwKSxuLnNldFVpbnQxNigzMix0aGlzLmJ5dGVzUGVyU2FtcGxlKnRoaXMubnVtYmVyT2ZDaGFubmVscywhMCksbi5zZXRVaW50MTYoMzQsdGhpcy5iaXREZXB0aCwhMCksbi5zZXRVaW50MzIoMzYsMTY4NDEwODM4NSwhMSksbi5zZXRVaW50MzIoNDAsdCwhMCk7Zm9yKHZhciBvPTA7bzx0aGlzLnJlY29yZGVkQnVmZmVycy5sZW5ndGg7bysrKXIuc2V0KHRoaXMucmVjb3JkZWRCdWZmZXJzW29dLG8qZSs0NCk7cmV0dXJue21lc3NhZ2U6InBhZ2UiLHBhZ2U6cn19LCJmdW5jdGlvbiI9PXR5cGVvZiByZWdpc3RlclByb2Nlc3Nvcil7dmFyIHA9ZnVuY3Rpb24oZSl7IWZ1bmN0aW9uKGUsdCl7aWYoImZ1bmN0aW9uIiE9dHlwZW9mIHQmJm51bGwhPT10KXRocm93IG5ldyBUeXBlRXJyb3IoIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uIik7ZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOmUsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLHQmJmMoZSx0KX0oaCxlKTt2YXIgdCxyLG4saSxhLHA9KHQ9aCxyPXUoKSxmdW5jdGlvbigpe3ZhciBlLG49Zih0KTtpZihyKXt2YXIgbz1mKHRoaXMpLmNvbnN0cnVjdG9yO2U9UmVmbGVjdC5jb25zdHJ1Y3Qobixhcmd1bWVudHMsbyl9ZWxzZSBlPW4uYXBwbHkodGhpcyxhcmd1bWVudHMpO3JldHVybiBzKHRoaXMsZSl9KTtmdW5jdGlvbiBoKCl7dmFyIGU7cmV0dXJuIGZ1bmN0aW9uKGUsdCl7aWYoIShlIGluc3RhbmNlb2YgdCkpdGhyb3cgbmV3IFR5cGVFcnJvcigiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uIil9KHRoaXMsaCksKGU9cC5jYWxsKHRoaXMpKS5jb250aW51ZVByb2Nlc3M9ITAsZS5wb3J0Lm9ubWVzc2FnZT1mdW5jdGlvbih0KXt2YXIgcj10LmRhdGE7c3dpdGNoKHIuY29tbWFuZCl7Y2FzZSJkb25lIjplLnJlY29yZGVyJiYoZS5wb3N0UGFnZShlLnJlY29yZGVyLnJlcXVlc3REYXRhKCkpLGUucG9ydC5wb3N0TWVzc2FnZSh7bWVzc2FnZToiZG9uZSJ9KSxkZWxldGUgZS5yZWNvcmRlcik7YnJlYWs7Y2FzZSJjbG9zZSI6ZS5jb250aW51ZVByb2Nlc3M9ITE7YnJlYWs7Y2FzZSJpbml0IjplLnJlY29yZGVyPW5ldyBsKHIpLGUucG9ydC5wb3N0TWVzc2FnZSh7bWVzc2FnZToicmVhZHkifSl9fSxlfXJldHVybiBuPWgsKGk9W3trZXk6InByb2Nlc3MiLHZhbHVlOmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnJlY29yZGVyJiZlWzBdJiZlWzBdLmxlbmd0aCYmZVswXVswXSYmZVswXVswXS5sZW5ndGgmJnRoaXMucmVjb3JkZXIucmVjb3JkKGVbMF0pLHRoaXMuY29udGludWVQcm9jZXNzfX0se2tleToicG9zdFBhZ2UiLHZhbHVlOmZ1bmN0aW9uKGUpe2UmJnRoaXMucG9ydC5wb3N0TWVzc2FnZShlLFtlLnBhZ2UuYnVmZmVyXSl9fV0pJiZvKG4ucHJvdG90eXBlLGkpLGEmJm8obixhKSxofShpKEF1ZGlvV29ya2xldFByb2Nlc3NvcikpO3JlZ2lzdGVyUHJvY2Vzc29yKCJlbmNvZGVyLXdvcmtsZXQiLHApfWVsc2V7dmFyIGg7b25tZXNzYWdlPWZ1bmN0aW9uKGUpe3ZhciB0LHI9ZS5kYXRhO3N3aXRjaChyLmNvbW1hbmQpe2Nhc2UiZW5jb2RlIjpoJiZoLnJlY29yZChyLmJ1ZmZlcnMpO2JyZWFrO2Nhc2UiZG9uZSI6aCYmKCh0PWgucmVxdWVzdERhdGEoKSkmJnBvc3RNZXNzYWdlKHQsW3QucGFnZS5idWZmZXJdKSxwb3N0TWVzc2FnZSh7bWVzc2FnZToiZG9uZSJ9KSxoPW51bGwpO2JyZWFrO2Nhc2UiY2xvc2UiOmNsb3NlKCk7YnJlYWs7Y2FzZSJpbml0IjpoPW5ldyBsKHIpLHBvc3RNZXNzYWdlKHttZXNzYWdlOiJyZWFkeSJ9KX19fShlPWV8fHt9KS5leHBvcnRzPWx9XSl9KSk7"
    });
}

function startRecording() {
    recorder.start().catch(function (e) {
        screenLogger('Error encountered:', e.message);
    });

    recorder.onstart = function () {
        $(".mic").hide();
        $(".mic-stop").show();
    };

    recorder.onstop = function () {
        $(".mic-stop").hide();
        $(".mic").show();
    };

    recorder.onstreamerror = function (e) {
        screenLogger('Error encountered: ' + e.message);
    };

    recorder.ondataavailable = function (typedArray) {
        var dataBlob = new Blob([typedArray], { type: 'audio/wav' });
        var url = URL.createObjectURL(dataBlob);
        var audioElement = document.getElementById('recordedAudio');
        audioElement.src = url;

        var SoundFileObject = new File([typedArray], "test.wav", { type: 'audio/wav' });

        var apiUrl = 'https://octopiandevcoreapim.azure-api.net/AI/?language=en-US&format=detailed';
        // Use Fetch API instead of jQuery.ajax for a more modern approach
        ShowLoader();
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': APIKEY,
                'Content-Type': 'audio/wave'
            },
            body: SoundFileObject
        })
            .then(response => response.json()) // Parse the response as JSON
            .then(response => {
                HideLoader();
                //console.log(response);
                generateMedicalRecordByVoice(response.DisplayText)
            })
            .catch(error => {
                HideLoader();
                console.error('Error:', error);
                alert('Error uploading the file. Please try again.');
            });
    };
}

function stopRecording() {
    recorder.stop();
}

function screenLogger(text, data) {
    log.innerHTML += "\n" + text + " " + (data || '');
}


//#endregion Recording  