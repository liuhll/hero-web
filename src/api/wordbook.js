import request from '@/utils/request'
import setting from '@/settings'

export function getWordbookitemByCode(code) {
    return request({
        url: `${setting.apiPrefix}/wordbook/items/code/${code}`,
        method: 'get'
    })
}


export function createWordbook(input) {
    return request({
        url: `${setting.apiPrefix}/wordbook`,
        method: 'post',
        data: { input: input }
    })
}

export function updateWordbook(input) {
    return request({
        url: `${setting.apiPrefix}/wordbook`,
        method: 'put',
        data: { input: input }
    })
}

export function deleteWordbook(id) {
    return request({
        url: `${setting.apiPrefix}/wordbook/${id}`,
        method: 'delete'
    })
}


export function getWordbook(id) {
    return request({
        url: `${setting.apiPrefix}/wordbook/${id}`,
        method: 'get'
    })
}

export function searchWordbook(query) {
    return request({
        url: `${setting.apiPrefix}/wordbook/search`,
        method: 'post',
        data: { query: query }
    })
}


export function createWordbookItem(input) {
    return request({
        url: `${setting.apiPrefix}/wordbook/item`,
        method: 'post',
        data: { input: input }
    })
}


export function updateWordbookItem(input) {
    return request({
        url: `${setting.apiPrefix}/wordbook/item`,
        method: 'put',
        data: { input: input }
    })
}


export function getWordbookItemsById(id) {
    return request({
        url: `${setting.apiPrefix}/wordbook/item/${id}`,
        method: 'put'
    })
}

export function deleteWordbookItem(id) {
    return request({
        url: `${setting.apiPrefix}/wordbook/item/${id}`,
        method: 'delete'
    })
}

export function getWordbookItems(input) {
    return request({
        url: `${setting.apiPrefix}/wordbook/items/page`,
        method: 'post',
        data: { input: input }
    })
}

