import { fetchApi } from '@/utils/http'
import { CompanyType } from '../api/company-api'
import {
  CreateCostCenterType,
  CreateDepartmentType,
  GetCostCenterType,
  GetDepartmentType,
} from '@/utils/type'

export async function getAllDepartments(token: string) {
  return fetchApi<GetDepartmentType[]>({
    url: 'api/department/getall',
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function createDepartment(
  data: CreateDepartmentType,
  token: string
) {
  return fetchApi<CreateDepartmentType>({
    url: 'api/department/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllCompany(token: string) {
  return fetchApi<CompanyType[]>({
    url: 'api/company/get-all-companies',
    method: 'GET',
    headers: {
      Authentication: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function createCostCenter(
  data: CreateCostCenterType,
  token: string
) {
  return fetchApi<CreateCostCenterType>({
    url: 'api/costCenter/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllCostCenters(token: string) {
  return fetchApi<GetCostCenterType[]>({
    url: 'api/costCenter/getall',
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}