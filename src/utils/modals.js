function getModal(id){
    const el = document.getElementById(id);
    if (!el) return null;
    return new bootstrap.Modal(el, { backdrop: 'static' });
}

export function showConfirm(message, title = 'Conferma'){
    return new Promise(resolve => {
        const modalEl = document.getElementById('confirmModal');
        const modal = getModal('confirmModal');
        document.getElementById('confirmModalTitle').textContent = title;
        document.getElementById('confirmModalBody').textContent = message;

        const okBtn = document.getElementById('confirmModalOk');
        const onOk = () => {
            cleanup();
            resolve(true);
        };
        const onHide = () => {
            cleanup();
            resolve(false);
        };
        function cleanup(){
            okBtn.removeEventListener('click', onOk);
            modalEl.removeEventListener('hidden.bs.modal', onHide);
            try{ modal.hide(); }catch(e){}
        }

        okBtn.addEventListener('click', onOk);
        modalEl.addEventListener('hidden.bs.modal', onHide);
        modal.show();
    });
}

export function showAlert(message, title = 'Avviso'){
    return new Promise(resolve => {
        const modalEl = document.getElementById('alertModal');
        const modal = getModal('alertModal');
        document.getElementById('alertModalTitle').textContent = title;
        document.getElementById('alertModalBody').textContent = message;

        const onHide = () => {
            modalEl.removeEventListener('hidden.bs.modal', onHide);
            try{ modal.hide(); }catch(e){}
            resolve();
        };
        modalEl.addEventListener('hidden.bs.modal', onHide);
        modal.show();
    });
}

if (typeof window !== 'undefined') {
    window.showConfirm = showConfirm;
    window.showAlert = showAlert;
}

export default { showConfirm, showAlert };
