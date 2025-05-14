import { fetchApi } from '@/utils/http'
import { CompanyType } from '../api/company-api'
import {
  CreateAssetType,
  CreateCategoryType,
  CreateCompanyType,
  CreateCostCenterType,
  CreateDepartmentType,
  CreateLocationType,
  CreateSiteType,
  CreateSupplierType,
  GetAssetType,
  GetCategoryType,
  GetCompanyType,
  GetCostCenterType,
  GetDepartmentType,
  GetLocationType,
  GetSiteType,
  GetSupplierType,
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

export async function createCompany(
  data: CreateCostCenterType,
  token: string
) {
  return fetchApi<CreateCompanyType>({
    url: 'api/company/create-company',
    method: 'POST',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllCompanies(token: string) {
  return fetchApi<GetCompanyType[]>({
    url: 'api/company/get-all-companies',
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function createCategory(
  data: CreateCategoryType,
  token: string
) {
  return fetchApi<CreateCategoryType>({
    url: 'api/category/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllCategories(token: string) {
  return fetchApi<GetCategoryType[]>({
    url: 'api/category/getall',
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function createAsset(
  data: CreateAssetType,
  token: string
) {
  return fetchApi<CreateAssetType>({
    url: 'api/asset/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllAssets(token: string) {
  return fetchApi<GetAssetType[]>({
    url: 'api/asset/getall',
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function createSupplier(
  data: CreateSupplierType,
  token: string
) {
  return fetchApi<CreateSupplierType>({
    url: 'api/supplier/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllSuppliers(token: string) {
  return fetchApi<GetSupplierType[]>({
    url: 'api/supplier/getall',
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function createLocation(
  data: CreateLocationType,
  token: string
) {
  return fetchApi<CreateLocationType>({
    url: 'api/location/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllLocations(token: string) {
  return fetchApi<GetLocationType[]>({
    url: 'api/location/getall',
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function createSite(
  data: CreateSiteType,
  token: string
) {
  return fetchApi<CreateSiteType>({
    url: 'api/section/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllSites(token: string) {
  return fetchApi<GetSiteType[]>({
    url: 'api/section/getall',
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}