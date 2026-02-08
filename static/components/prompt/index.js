const inputs = [];

function enableSubmit() {
    const required = inputs.filter($input => $input.prop('required'));
    const hasValue = required.length === 0 || required.some($input => $input.val().trim());

    $('#submit').prop('disabled', !hasValue);
}

window.promptAPI.init((_, config) => {
    if (config.title) $('#header').text(config.title);

    config.fields.forEach(field => {
        const $div = $('<div>', { class: "input-container" });
        const $label = $('<label>', { class: "label", for: "input" }).text(field.label);
        const $inputContainer = $('<div>', { class: "input" });
        const $input = $('<input>', { ...field.attributes }).on('input', enableSubmit);

        $inputContainer.append($input);
        $div.append($label, $inputContainer);
        $('#fields').append($div);

        inputs.push($input);
    });

    enableSubmit();
});

$(document).on('keydown', (e) => {
    if (e.key === 'Enter' && !$('#submit').prop('disabled')) {
        $('#submit').click();
    }
});

$('#cancel').on('click', () => window.promptAPI.cancel());
$('#submit').on('click', () => window.promptAPI.submit(inputs.map(($input) => $input.val())));