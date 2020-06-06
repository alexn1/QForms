'use strict';

class TableFormController extends FormController {
    constructor(model, view, parent) {
        super(model, view, parent);
        this.grid        = null;
        this.framesCount = null;
        this.$goto       = null;
    }

    init() {
        const self = this;
        super.init();
        this.model.on('refilled', this.listeners.refilled = this.onRefilled.bind(this));
        this.model.on('refresh', this.listeners.refreshed = this.onRefreshed.bind(this));
        $(this.view).find('button.refresh').click(function() {
            self.onRefreshClick(this);
        });
        $(this.view).find('button.new').click(function() {
            self.onNewClick(this);
        });
        $(this.view).find('button.delete').click(function() {
            self.onDeleteClick(this);
        });
        $(this.view).find('button.next').click(function() {
            self.onNextClick(this);
        });
        $(this.view).find('button.previous').click(function() {
            self.onPreviousClick(this);
        });
        this.$count = $(this.view).find('span.count');
        this.$goto = $(this.view).find('select.goto');
        this.$goto.change(function() {
            self.onGotoChange(this);
        });
        const gridSelector = `#${this.model.page.id}_${this.model.name}_GridWidget`;
        this.grid = new DataGridWidget(this.view.querySelector(gridSelector), this);
        this.grid.init();
        this.parent.on('hide', this.listeners.hide = this.onHidePage.bind(this));
        this.parent.on('show', this.listeners.show = this.onShowPage.bind(this));
        this.grid.on('bodyCellDblClick', this.listeners.bodyCellDblClick = this.onGridCellDblClick.bind(this));
    }

    deinit() {
        this.parent.off('hide', this.listeners.hide);
        this.parent.off('show', this.listeners.show);
        this.grid.off('bodyCellDblClick', this.listeners.bodyCellDblClick);
        this.grid.deinit();
        this.model.off('refilled', this.listeners.refilled);
        this.model.off('refresh', this.listeners.refreshed);
        super.deinit();
    }

    fill() {
        console.log('TableFormController.fill', this.model.name);
        super.fill();
        if (this.model.dataSource.limit) {
            $(this.view).find('.paging').css('display', 'block');
            this.setCountText();
        }
        this.framesCount = this.model.dataSource.getFramesCount();
        if (this.framesCount) {
            for (let i = 1; i <= this.framesCount; i++) {
                const option = $('<option></option>');
                option.val(i);
                option.html(i);
                this.$goto.append(option);
            }
        }
        this.grid.fill();
    }

    setCountText() {
        const count = `${this.model.dataSource.length} of ${this.model.dataSource.count}`;
        this.$count.text(count);
    }

    updateCountAndGoTo() {
        if (this.model.dataSource.limit) {
            this.setCountText();
        }
        this.framesCount = this.model.dataSource.getFramesCount();
        if (this.framesCount) {
            this.$goto.empty();
            for (let i = 1; i <= this.framesCount; i++) {
                const option = $('<option></option>');
                option.val(i);
                option.html(i);
                this.$goto.append(option);
            }
        }
    }

    onRefilled(ea) {
        console.log('TableFormController.onRefilled', this.model.name);
        this.grid.clear();
        this.updateCountAndGoTo();
        this.grid.fill();
    }

    onRefreshed(ea) {
        console.log('TableFormController.onRefreshed', this.model.getFullName());
        this.updateCountAndGoTo();
    }

    async onNewClick(ctrl) {
        await this.new();
    }

    async onRefreshClick(ctrl) {
        console.log('TableFormController.onRefreshClick', this.model.getFullName());
        await this.model.refresh();
        // console.error('refresh error handler:', err.message);
        // alert(err.message);
    }

    onDeleteClick(ctrl) {
        console.log('TableFormController.onDeleteClick');
        if (confirm(this.model.page.app.data.text.form.areYouSure)) {
            const key = this.grid.getSelectedKey();
            if (key !== null) {
                this.model.delete(key);
            }
        }
    }

    onNextClick(ctrl) {
        const frame = parseInt(this.$goto.val()) + 1;
        if (frame <= this.framesCount) {
            this.$goto.val(frame);
            this.model.frame(frame);
        }
    }

    onPreviousClick(ctrl) {
        const frame = parseInt(this.$goto.val()) - 1;
        if (frame > 0) {
            this.$goto.val(frame);
            this.model.frame(frame);
        }
    }

    onGotoChange(ctrl) {
        const frame = parseInt(ctrl.value);
        this.model.frame(frame);
    }

    onGridCellDblClick(ea) {
        const bodyCell = ea.bodyCell;
        const key = bodyCell.bodyRow.qKey;
        switch (this.model.data.editMethod) {
            case 'table':
                if (this.model.dataSource.data.access.update === true) {
                    this.grid.gridColumns[bodyCell.qFieldName].beginEdit(bodyCell);
                }
            break;
            case 'form':
                this.edit(key);
            break;
        }
    }

    onHidePage() {
        this.grid.saveScroll();
    }

    onShowPage() {
        console.log('TableFormController.onShowPage', this.model.name);
        if (!this.grid.isHidden()) {
            this.grid.restoreScroll();
            this.grid.focus();
            // console.log('document.activeElement:', document.activeElement);
        }
    }

    async new() {
        if (this.model.data.newRowMode === 'oneclick') {
            const row = {};
            this.model.defaultValuesToRow(row);
            this.model.dataSource.insert(row);
        } else if (this.model.data.newRowMode === 'editform') {
            if (!this.model.data.itemEditPage) {
                throw new Error('[' + this.model.getFullName() + '] itemEditPage is empty.');
            }
            await this.openPage({
                name   : this.model.data.itemEditPage,
                newMode: true
            });
        } else if (this.model.data.newRowMode === 'createform') {
            if (!this.model.data.itemCreatePage) {
                throw new Error('[' + this.model.getFullName() + '] itemCreatePage is empty.');
            }
            await this.openPage({
                name   : this.model.data.itemCreatePage,
                newMode: true
            });
        } else if (this.model.data.newRowMode === 'oneclick editform') {
            if (!this.model.data.itemEditPage) {
                throw new Error('[' + this.model.getFullName() + '] itemEditPage is empty.');
            }
            const row = {};
            this.model.defaultValuesToRow(row);
            const key = await this.model.dataSource.insert(row);
            await this.openPage({
                name: this.model.data.itemEditPage,
                key : key
            });
        } else if (this.model.data.newRowMode === 'oneclick createform') {
            if (!this.model.data.itemCreatePage) {
                throw new Error('[' + this.model.getFullName() + '] itemCreatePage is empty.');
            }
            const row = {};
            this.model.defaultValuesToRow(row);
            const key2 = await this.model.dataSource.insert(row);
            await this.openPage({
                name: this.model.data.itemCreatePage,
                key : key2
            });
        }
        /*switch (this.model.data.newRowMode) {
            case 'oneclick': break;
            case 'editform': break;
            case 'createform': break;
            case 'oneclick editform': break;
            case 'oneclick createform': break;
        }*/
    }

    async edit(key) {
        console.log('TableForm.edit', this.model.getFullName());
        if (!this.model.data.itemEditPage) {
            throw new Error('[' + this.model.getFullName() + '] itemEditPage is empty.');
        }
        try {
            await this.openPage({
                name: this.model.data.itemEditPage,
                key : key
            });
        } catch (err) {
            console.error('edit form error handler:', err.message, err.stack);
            alert(err.message);
        }
    }
}
