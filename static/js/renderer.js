window.ipcRenderer.on('users', (event, data) => {
    let isProtected = true;
    let someProtected = false;
    $('.results.users').empty();

    if (data.length === 0) {
        return $('.results.users').append('<p style="color: grey; font-size: 14px;">No accounts found in Bitwarden Desktop app.</p>');
    }

    data.forEach(user => {
        const userElement = $(`
					<div class="result" uid="${user.id}">
						<p style="margin: 0px; color: inherit">${user.name ?? 'Bitwarden User'} (${user.region})</p>
						<small style="margin-top: 5px;">Email Address: ${user.email}</small>
						<small style="margin-top: 5px;">User ID: ${user.uid}</small>
						<small style="margin-top: 5px; color: ${user.active ? 'green' : 'red'}; cursor: pointer;" class="toggle">${user.active ? 'Automatic backups are enabled. Click to disable.' : 'Automatic backups are disabled. Click to enable.'}</small>
						<button class="secondary backup">Backup Now</button>
					</div>
				`);

        userElement.find('.toggle').on('click', () => {
            window.ipcRenderer.send('toggle', user);
        });

        userElement.find('.backup').on('click', () => {
            userElement.find('.backup').text('Backing up...').prop('disabled', true);
            window.ipcRenderer.send('backup', user);

            setTimeout(() => {
                userElement.find('.backup').text('Backup Now').prop('disabled', false);
            }, 1000);
        });

        $('.results.users').append(userElement);
        if (!user.active) {
            isProtected = false;
        } else {
            someProtected = true;
        }
    });

    if (data.length === 0) return $('.status').text('Your Bitwarden accounts are not logged in to Bitwarden Desktop.').css('color', 'orange');

    if (isProtected) {
        return $('.status').text(data.length > 1 ? 'Your Bitwarden accounts are protected with automatic backups.' : 'Your Bitwarden account is protected with automatic backups.').css('color', 'green');
    } else if (someProtected && data.length > 1) {
        return $('.status').text('Some of your Bitwarden accounts are protected with automatic backups.').css('color', 'orange');
    } else {
        return $('.status').text(data.length > 1 ? 'Your Bitwarden accounts are not protected with automatic backups.' : 'Your Bitwarden account is not protected with automatic backups.').css('color', 'red');
    }
});

window.ipcRenderer.on('backups', (event, data) => {
    $('.results.backups').empty();

    if (data.length === 0) {
        return $('.results.backups').append('<p style="color: grey; font-size: 14px;">No backups found in your storage location.</p>');
    }

    data.forEach(backup => {
        const backupElement = $(`
					<div class="result">
						<small>Created At: <b>${new Date(backup.createdAt).toISOString().replace('T', ' ').replace('Z', '').split('.')[0]}</b></small>
						<small style="margin-top: 5px;">Location: ${backup.id}</small>
						<small style="margin-top: 5px;">Size: ${backup.size} bytes</small>
						<button class="secondary restore">Restore</button>
					</div>
				`);

        backupElement.find('.restore').on('click', () => {
            window.ipcRenderer.send('restore', backup.location);
        });

        $('.results.backups').append(backupElement);
    });
});

window.ipcRenderer.on('settings', (event, data) => {
    try {
        $("#occurrence .selected").val(data.occurrence);

        const label = $(`#occurrence .select div[value="${data.occurrence}"]`).text();
        $("#occurrence .selected").text(label);

        $("#folder").val(data.folder);
        $("#keeping").val(data.keeping);

        let latestBackup = 0;

        for (const user of data.users) {
            if (user?.lastBackup && user.lastBackup > latestBackup) {
                latestBackup = user.lastBackup;
            }
        }

        if (latestBackup > 0) {
            $("#last_backup").text(new Date(latestBackup).toISOString().replace('T', ' ').replace('Z', '').split('.')[0]);
        } else {
            $("#last_backup").text('Never');
        }
    } catch (error) {
        log.error('[Renderer] Failed to load settings:', error);
        return;
    }
});

window.ipcRenderer.on('version', (event, res) => {
    try {
        if (res.upToDate) {
            $("#version").html(`Software version: v${res.currentVersion} (up-to-date)`);
        } else {
            $("#version").html(`Software version: v${res.currentVersion} (<u id='update_now' style='cursor: pointer;'>update now</u>)`);

            $('#update_now').on('click', () => {
                window.shell.openExternal(res.downloadUrl);
            });
        }
    } catch (error) {
        log.warn('[Renderer] Unable to load version information, displaying generic version info:', error);

        if (res.currentVersion) {
            $("#version").html(`Software version: v${res.currentVersion} (unknown)`);
        } else {
            $("#version").html(`Warning: Your software may be outdated.`);
        }
    }
});

window.ipcRenderer.on('tray_click', (event, data) => {
    const elem = $(`.nav-item[name="${data.action}"]`);
    if (!elem) return;

    $('.nav-item').removeClass('active');
    $('.page').removeClass('active');

    elem.addClass('active');
    $('.page.' + elem.attr('name')).addClass('active');
});

$('#save_settings').on('click', () => {
    const occurrence = $("#occurrence .selected").val();
    const folder = $("#folder").val();
    const keeping = $("#keeping").val();

    window.ipcRenderer.send('settings', { occurrence, folder, keeping });
});

$('#restore_backup').on('click', () => {
    return window.ipcRenderer.send('restore');
});

$(document).ready(function () {
    $('.nav-item').on('click', function () {
        $('.nav-item').removeClass('active');
        $('.page').removeClass('active');

        $(this).addClass('active');
        $('.page.' + $(this).attr('name')).addClass('active');
    });

    $('.dropdown .button').on('click', function () {
        const dropdown = $(this).closest('.dropdown');

        $('.dropdown').not(dropdown).removeClass('open');
        dropdown.toggleClass('open');
    });

    $('.dropdown .select div').on('click', function () {
        const value = $(this).attr('value');
        const label = $(this).text();
        const dropdown = $(this).closest('.dropdown');

        dropdown.find('.selected').attr('value', value).val(value).text(label);
        dropdown.removeClass('open');
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown').removeClass('open');
        }
    });

    const now = new Date();
    const hour = now.getHours();
    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    $('.title').text(`${greeting}! 👋`);
});