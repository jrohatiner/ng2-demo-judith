"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ExpensesList = (function () {
    function ExpensesList() {
        this.editExpense = new core_1.EventEmitter();
    }
    ExpensesList.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.refreshItems();
        this.grid.nativeElement.then(function () {
            _this.gridReady(_this.grid.nativeElement);
        });
    };
    ExpensesList.prototype.gridReady = function (grid) {
        var _this = this;
        grid.cellClassGenerator = function (cell) {
            if (cell.columnName === 'status') {
                return 'status-' + cell.data.replace(/ /g, '-').toLowerCase();
            }
        };
        grid.addEventListener('sort-order-changed', function (e) {
            var sortBy = grid.columns[e.detail.value[0].column].name;
            _this.sortOrder = { sortBy: sortBy, direction: e.detail.value[0].direction };
            // sort order is fired for the first time before grid has been initialized properly,
            // so scrolling will crash.
            try {
                grid.scrollToStart(0);
                grid.refreshItems();
            }
            catch (err) {
            }
        });
        grid.columns[0].renderer = function (cell) {
            cell.element.innerHTML = moment(cell.data).format('YYYY-MM-DD');
        };
        grid.columns[2].renderer = function (cell) {
            cell.element.innerHTML = accounting.formatMoney(cell.data);
        };
        grid.columns[3].renderer = function (cell) {
            var status = cell.data.replace(/_/g, ' ');
            status = status.charAt(0).toUpperCase() + status.slice(1);
            cell.element.textContent = status;
        };
    };
    ExpensesList.prototype.expenses = function (params, callback) {
        var _this = this;
        var filters = this.filters || {};
        var sortOrder = this.sortOrder || {};
        var url = './api/expenses?index=' + params.index +
            '&count=' + params.count +
            '&merchant=' + (filters.merchant || '') +
            '&min=' + (filters.min || '') +
            '&max=' + (filters.max || '') +
            '&before=' + (filters.before || '') +
            '&after=' + (filters.after || '') +
            '&statuses=' + (filters.statuses || '') +
            '&sortBy=' + (sortOrder.sortBy) +
            '&sortDirection=' + (sortOrder.direction);
        //this.http.get(url)
        //  .subscribe(response => {...});
        // In this demo we'll use a dummy datasource instead of an actual xhr
        var totalCount = 2000;
        totalCount -= filters.merchant ? 1000 : 0;
        totalCount -= filters.min ? 300 : 0;
        totalCount -= filters.max ? 300 : 0;
        window.getJSON(url, function (data) {
            callback(data, totalCount);
            if (data.length === 0 && _this.toast) {
                _this.toast.nativeElement.open();
            }
            else if (_this.toast) {
                _this.toast.nativeElement.hide();
            }
        });
    };
    ExpensesList.prototype.selected = function (grid) {
        var _this = this;
        var selection = grid.selection.selected();
        if (selection.length === 1) {
            grid.selection.clear();
            grid.getItem(selection[0], function (err, item) {
                _this.editExpense.emit(item);
            });
        }
    };
    ExpensesList.prototype.onFiltersChanged = function (grid) {
        if (Polymer && Polymer.isInstance(grid)) {
            grid.scrollToStart(0);
            grid.refreshItems();
        }
    };
    ExpensesList.prototype.refreshItems = function () {
        var _this = this;
        // This will make grid update it's items (since the datasource changes)
        this.expenses = this.expenses.bind(this);
        // Update merchant list
        window.getJSON('./api/merchants', function (data) {
            _this.merchants = data.sort();
        });
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ExpensesList.prototype, "editExpense", void 0);
    __decorate([
        core_1.ViewChild('grid'),
        __metadata("design:type", Object)
    ], ExpensesList.prototype, "grid", void 0);
    __decorate([
        core_1.ViewChild('toast'),
        __metadata("design:type", Object)
    ], ExpensesList.prototype, "toast", void 0);
    ExpensesList = __decorate([
        core_1.Component({
            selector: 'expenses-list',
            templateUrl: './app/expenses-list/expenses_list.component.html',
            styleUrls: ['./app/expenses-list/expenses_list.component.css']
        })
    ], ExpensesList);
    return ExpensesList;
}());
exports.ExpensesList = ExpensesList;
//# sourceMappingURL=expenses_list.component.js.map