import { fetchApi } from '@/utils/http'
import { CompanyType } from '../api/company-api'
import { CreateDepartmentType, GetDepartmentType } from '@/utils/type'

export async function getAllDepartments(token: string) {
  return fetchApi<GetDepartmentType[]>({
    url: 'api/department/getall',
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    }
  })
}

export async function createDepartment(data: CreateDepartmentType) {
  console.log('Creating department:', data)
  return fetchApi<CreateDepartmentType>({
    url: 'api/department/create-department',
    method: 'POST',
    body: data,
  })
}

//get all companies api
export async function getAllCompany() {
  return fetchApi<CompanyType[]>({
    url: 'api/company/get-all-companies',
    method: 'GET',
  })
}

