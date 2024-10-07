import { apiErrorHandler } from '@/app/api/utils/api-error-handler'
import {
  CreateProductDto,
  ProductResponseDto
} from '@/core/application/dto/product-dto'
import { CreateProduct } from '@/core/application/use-cases/product/create-product-use-case'
import { FetchAllProducts } from '@/core/application/use-cases/product/fetch-all-products-use-case'
import {
  container,
  Registry
} from '@/core/infrastructure/container-registry/container-registry'
import { NextResponse } from 'next/server'

const createProductUseCase: CreateProduct = container.get<CreateProduct>(
  Registry.CreateProductUseCase
)

const fetchAllProductsUseCase: FetchAllProducts =
  container.get<FetchAllProducts>(Registry.FetchAllProductsUseCase)

export async function POST(
  request: Request,
  { params }: { params: { id: string; ledgerId: string } }
) {
  try {
    const body = await request.json()
    const organizationId = params.id
    const ledgerId = params.ledgerId

    const productCreated = await createProductUseCase.execute(
      organizationId,
      ledgerId,
      body
    )

    return NextResponse.json(productCreated)
  } catch (error: any) {
    console.error('Error creating product', error)
    const { message, status } = await apiErrorHandler(error)

    return NextResponse.json({ message }, { status })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string; ledgerId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 10
    const page = Number(searchParams.get('page')) || 1
    const organizationId = params.id
    const ledgerId = params.ledgerId

    const products = await fetchAllProductsUseCase.execute(
      organizationId,
      ledgerId,
      limit,
      page
    )

    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Error fetching all products', error)
    const { message, status } = await apiErrorHandler(error)

    return NextResponse.json({ message }, { status })
  }
}
