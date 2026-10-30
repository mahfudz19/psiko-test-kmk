'use client'

import Image from 'next/image'
import { JSX, useCallback, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import IconAlertCircleTwotone from '../Icon/IconAlertCircleTwotone'
import IconClose from '../Icon/IconClose'
import IconDownload from '../Icon/IconDownload'
import IconFile from '../Icon/IconFile'
import IconUpload from '../Icon/IconUpload'
import IconButton from '../IconButton'
import Progress from '../Progress'
import Skeleton from '../Skeleton'
import { commonMimeTypes } from './commonMimeTypes'
import CircularProgress from '../CircularProgress'
import Typography from '../Typograph'

interface Props {
  id?: string
  label?: string | JSX.Element
  value: (string | File | FormData)[]
  onChange?: (formData: FormData[], file: File[]) => Promise<any> | void
  handleOnChangeError?: (error: any) => Promise<any>
  downloadPrivateFile?: (body: string | File | FormData) => Promise<any>
  deletePrivateFile?: (nameFile: string | File | FormData, updatedValues: (string | File | FormData)[]) => Promise<any>
  limit?: number
  sizeLimit?: number
  error?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  isLoad?: boolean
  moreText?: string
  autoLimitFiles?: boolean
  classNames?: { root?: string; container?: string }
}

const convertBytesToMB = (bytes: number): string => (bytes / (1024 * 1024)).toFixed(2) + ' MB'

const getFileTypeIcon = (file: File | string, size = 70) => {
  let mimeType = ''

  if (typeof file === 'string') {
    // Try to determine mime type from extension
    const extension = '.' + file.split('.').pop()?.toLowerCase()
    const found = commonMimeTypes.find(type => type.extensions.includes(extension))
    mimeType = found?.mime || ''
  } else if (file && typeof file === 'object' && 'type' in file) mimeType = file.type

  // Find matching mime type
  const fileType = commonMimeTypes.find(type => type.mime === mimeType)

  if (fileType) return fileType.icon

  return <IconFile fontSize={size} className='text-gray-500' />
}

const getFileName = (file: File | string | FormData): string => {
  if (typeof file === 'string') return file.split('/').pop() || file
  if (file && typeof file === 'object' && 'name' in file && typeof file.name === 'string') return file.name
  return 'FormData'
}

const getFileSize = (file: File | string | FormData): number => {
  if (file && typeof file === 'object' && 'size' in file && typeof file.size === 'number') return file.size
  return 0
}

// Loading skeleton for document cards
const DocumentSkeleton = () => (
  <div className='flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-300 dark:border-blue-500 w-[120px] max-w-[120px] h-[120px] max-h-[120px] animate-pulse shadow-lg shadow-blue-200 dark:shadow-blue-900/50 ring-2 ring-blue-100 dark:ring-blue-800'>
    <div className='relative'>
      <Skeleton width='3rem' height='3rem' variant='rounded' />
      <div className='absolute inset-0 bg-blue-500/20 rounded animate-ping' />
    </div>
    <Skeleton width='4rem' height='0.75rem' className='mt-2 bg-blue-200 dark:bg-blue-700' />
    <Skeleton width='3rem' height='0.5rem' className='mt-1 bg-blue-100 dark:bg-blue-800' />
    <div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-bounce' />
  </div>
)

// Document components with loading states
const DocumentString = ({ src, alt, isLoading = false }: { src: string; alt: string; isLoading?: boolean }) => {
  const fileName = alt.split('/').pop() || alt

  if (isLoading) return <DocumentSkeleton />

  return (
    <div className='flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 w-[120px] max-w-[120px] h-[120px] max-h-[120px]'>
      <div title={getFileName(src)}>{getFileTypeIcon(src, 56)}</div>
      <p className='text-xs mt-2 text-center truncate w-full px-1' title={fileName}>
        {fileName}
      </p>
    </div>
  )
}

const DocumentFile = ({ src, alt, isLoading = false }: { src: File; alt: string; isLoading?: boolean }) => {
  if (isLoading) return <DocumentSkeleton />

  return (
    <div className='flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 w-[120px] max-w-[120px] h-[120px] max-h-[120px]'>
      {src.type.startsWith('image/') ? (
        <Image
          src={URL.createObjectURL(src) || '/placeholder.svg'}
          alt={alt}
          width={56}
          height={56}
          className='object-cover flex-1 max-w-[56px] min-w-[56px] max-h-[56px] min-h-[56px] rounded'
          onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
        />
      ) : (
        <div style={{ fontSize: 37.5 }}>{getFileTypeIcon(src, 56)}</div>
      )}
      <p className='text-xs mt-2 text-center truncate w-full px-1' title={alt}>
        {alt}
      </p>
      <p className='text-xs text-gray-500'>{convertBytesToMB(src.size)}</p>
    </div>
  )
}

const DocumentFormData = ({ isLoading = false }: { isLoading?: boolean }) => {
  if (isLoading) return <DocumentSkeleton />

  return (
    <div className='flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 w-[120px] max-w-[120px] h-[120px] max-h-[120px]'>
      <IconFile fontSize={50} className='text-gray-500' />
      <p className='text-xs mt-2 text-center' title='FormData'>
        FormData
      </p>
    </div>
  )
}

const DownloadItem = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
  <IconButton
    type='button'
    variant='text'
    sizes='small'
    onClick={e => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) onClick()
    }}
    disabled={disabled}
    className='absolute top-1 right-1 bg-primary-main/10 dark:bg-primary-main/25 p-1'
  >
    <IconDownload fontSize={12} />
  </IconButton>
)

const RemoveItem = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
  <IconButton
    type='button'
    variant='text'
    color='error'
    sizes='small'
    onClick={e => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) onClick()
    }}
    disabled={disabled}
    className='absolute top-1 left-1 bg-error-main/10 dark:bg-error-main/25 p-[5px]'
  >
    <IconClose fontSize={10} />
  </IconButton>
)

export default function MultipleFileUpload(props: Props) {
  const {
    id = `file-upload-${new Date().getTime()}`,
    label,
    value = [],
    onChange,
    handleOnChangeError,
    downloadPrivateFile,
    deletePrivateFile,
    limit = 10,
    sizeLimit = 1.25 * 1024 * 1024,
    error,
    required = false,
    disabled = false,
    readOnly = false,
    isLoad = false,
    moreText,
    autoLimitFiles = false,
    classNames
  } = props
  const [dragOver, setDragOver] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState<Set<string>>(new Set())
  const [alert, setAlert] = useState<{ message: string; alert: 'warning' | 'error' } | undefined>(undefined)

  const canUploadMore = !limit || value.length < limit
  const isFieldDisabled = disabled || isLoad
  const hasLoadingFiles = loadingFiles.size > 0
  const remainingSlots = limit ? limit - value.length : Number.POSITIVE_INFINITY

  const totalSize = value.reduce((acc, file) => acc + getFileSize(file), 0)
  const size = convertBytesToMB(sizeLimit)

  function handleAlert(message: string, alert: 'warning' | 'error') {
    setAlert({ alert, message })
    setTimeout(() => setAlert(undefined), 5000)
  }

  useEffect(() => {
    if (!isLoad) setLoadingFiles(new Set())
  }, [isLoad])

  const handleFileSelect = useCallback(
    async (files: FileList | null, valueLength: number) => {
      if (!files || files.length === 0) return

      let fileArray = Array.from(files)

      if (autoLimitFiles) {
        fileArray = fileArray.slice(0, remainingSlots)
        const warningMessage = `Only ${remainingSlots} of ${fileArray.length} selected files will be uploaded due to the ${limit} file limit.`
        handleAlert(warningMessage, 'warning')
        setTimeout(() => setAlert(undefined), 5000)
      } else if (valueLength + files.length > limit) {
        handleAlert(`Maximum ${limit} files allowed. Please remove some files first.`, 'error')
        setTimeout(() => setAlert(undefined), 5000)
        return
      }

      // Check total size limit
      const newFilesTotalSize = fileArray.reduce((acc, file) => acc + file.size, 0)
      const combinedTotalSize = totalSize + newFilesTotalSize
      if (combinedTotalSize > sizeLimit) {
        const combinedSizeMB = convertBytesToMB(combinedTotalSize)
        const error = `Total file size (${combinedSizeMB}) exceeds the ${size} size limit`
        handleAlert(error, 'error')
        if (handleOnChangeError) {
          await handleOnChangeError(error)
        }
        return
      }

      // Begin uploading: show loading state for all files
      const loadingKeys = new Set(fileArray.map(file => `${file.name}-${Date.now()}-${Math.random()}`))
      setLoadingFiles(prev => new Set([...Array.from(prev), ...Array.from(loadingKeys)]))

      try {
        const formDataArray: FormData[] = []
        for (const file of fileArray) {
          const formData = new FormData()
          formData.append('file', file)
          formDataArray.push(formData)
        }

        await onChange?.(formDataArray, fileArray)
      } catch (error: any) {
        handleAlert(error.message, 'error')
        if (handleOnChangeError) await handleOnChangeError(error)
      } finally {
      }
    },
    [totalSize, sizeLimit, autoLimitFiles, limit, remainingSlots, size, handleOnChangeError, onChange]
  )

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files, value.length)
    e.target.value = '' // Reset input
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (!readOnly && !disabled && !isLoad) handleFileSelect(e.dataTransfer.files, value.length)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!readOnly && !disabled && !isLoad) setDragOver(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeFile = async (fileToDelete: string | File | FormData, index: number) => {
    if (deletePrivateFile) {
      try {
        const updatedValues = value.filter((_, i) => i !== index)
        await deletePrivateFile(fileToDelete, updatedValues)
      } catch (error) {
        if (handleOnChangeError) await handleOnChangeError(error)
      }
    }
  }

  const downloadFile = async (file: string | File | FormData) => {
    if (downloadPrivateFile) {
      try {
        await downloadPrivateFile(file)
      } catch (error) {
        if (handleOnChangeError) await handleOnChangeError(error)
      }
    }
  }

  return (
    <div className={twMerge('relative', classNames?.root)}>
      {/* Label */}
      {label && (
        <div className='mb-2'>
          {required ? (
            <span className='inline-flex gap-1 items-center'>
              {label} <span className='text-error-main'>*</span>
            </span>
          ) : (
            label
          )}
        </div>
      )}

      {/* Limit Warning */}
      {alert && (
        <div
          className={
            alert.alert === 'warning'
              ? 'mb-3 border-warning-dark bg-warning-light/50 p-2 flex rounded-lg gap-1'
              : 'mb-3 border-error-dark bg-error-light/50 p-2 flex  rounded-lg gap-1'
          }
        >
          <div>
            <IconAlertCircleTwotone color={alert.alert} fontSize={18} />
          </div>
          <Typography
            component='div'
            variant='caption'
            className={alert.alert === 'warning' ? 'text-warning-dark' : 'text-error-dark'}
          >
            {alert.message}
          </Typography>
        </div>
      )}

      {/* Upload Container */}
      <label
        htmlFor={id}
        className={twMerge(
          'relative block overflow-hidden',
          'border-2 border-dashed rounded-lg transition-colors',
          dragOver && !isFieldDisabled
            ? 'border-primary-dark bg-primary-light/25'
            : 'border-divider bg-secondary-light/5',
          error && 'border-error-main',
          disabled && 'opacity-50 cursor-not-allowed',
          !canUploadMore && 'cursor-not-allowed',
          'w-full min-h-[12rem] p-4',
          classNames?.container
        )}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        {(isLoad || hasLoadingFiles) && <CircularProgress color='primary' className='absolute top-2 right-2 z-10' />}

        {/* File Display */}
        <div className='flex flex-wrap gap-3 mb-4'>
          {value.map((v: string | File | FormData, i: number) => {
            // For existing files, we don't show loading state since they're already uploaded
            const isFileLoading = false

            if (typeof v === 'string') {
              return (
                <div
                  className={twMerge(
                    'text-center relative transition-all duration-300',
                    isFileLoading && 'transform scale-105 shadow-lg shadow-blue-200 dark:shadow-blue-900/50'
                  )}
                  key={`${v}-${i}`}
                >
                  <DocumentString src={v ? v : ''} alt={v} isLoading={isFileLoading} />
                  {!isFieldDisabled && !isFileLoading && (
                    <DownloadItem onClick={() => downloadFile(v)} disabled={isLoad} />
                  )}
                  {!(readOnly || isFieldDisabled) && !isFileLoading && (
                    <RemoveItem onClick={() => removeFile(v, i)} disabled={isLoad} />
                  )}
                  {isFileLoading && <div className='absolute inset-0 bg-blue-500/10 rounded-lg animate-pulse' />}
                </div>
              )
            }

            if (v && typeof v === 'object' && 'name' in v && 'size' in v) {
              return (
                <div
                  className={twMerge(
                    'text-center relative transition-all duration-300',
                    isFileLoading && 'transform scale-105 shadow-lg shadow-blue-200 dark:shadow-blue-900/50'
                  )}
                  key={`${(v as File).name}-${i}`}
                >
                  <DocumentFile src={v as File} alt={(v as File).name} isLoading={isFileLoading} />
                  {!isFileLoading && <DownloadItem onClick={() => downloadFile(v)} disabled={isFieldDisabled} />}
                  {!(readOnly || isFieldDisabled) && !isFileLoading && (
                    <RemoveItem onClick={() => removeFile(v, i)} disabled={isLoad} />
                  )}
                  {isFileLoading && <div className='absolute inset-0 bg-blue-500/10 rounded-lg animate-pulse' />}
                </div>
              )
            }

            if (v instanceof FormData) {
              return (
                <div
                  className={twMerge(
                    'text-center relative transition-all duration-300',
                    isFileLoading && 'transform scale-105 shadow-lg shadow-blue-200 dark:shadow-blue-900/50'
                  )}
                  key={`formdata-${i}`}
                >
                  <DocumentFormData isLoading={isFileLoading} />
                  {!isFileLoading && <DownloadItem onClick={() => downloadFile(v)} disabled={isFieldDisabled} />}
                  {!(readOnly || isFieldDisabled) && !isFileLoading && (
                    <RemoveItem onClick={() => removeFile(v, i)} disabled={isLoad} />
                  )}
                  {isFileLoading && <div className='absolute inset-0 bg-blue-500/10 rounded-lg animate-pulse' />}
                </div>
              )
            }

            return null
          })}

          {/* Show loading skeletons for files being uploaded */}
          {Array.from(loadingFiles).map(f => (
            <div key={f} className='text-center relative transition-all duration-300'>
              <DocumentSkeleton />
            </div>
          ))}
        </div>

        {/* Upload Area */}
        {canUploadMore && !readOnly && (
          <div
            className={twMerge(
              // 'absolute top-0 left-0 right-0 bottom-0 -z-10 opacity-50 flex items-center justify-center',
              'cursor-pointer block',
              isFieldDisabled && 'cursor-not-allowed'
            )}
          >
            <div className={twMerge('flex flex-col items-center justify-center p-4 text-center text-text-secondary')}>
              <IconUpload
                color={hasLoadingFiles ? 'primary' : undefined}
                fontSize={40}
                className={twMerge('mb-3', hasLoadingFiles && 'animate-bounce')}
              />
              <p className='mb-2 text-sm font-semibold'>
                {isLoad
                  ? 'Uploading...'
                  : hasLoadingFiles
                  ? `Uploading ${loadingFiles.size} file(s)...`
                  : 'Click to upload or drag and drop'}
              </p>
              <p className='text-xs'>All File Types</p>
              {moreText && <p className='text-xs mt-1'>{moreText}</p>}
              {limit && (
                <p className='text-xs mt-1'>
                  {value.length}/{limit} files uploaded
                  {remainingSlots < Number.POSITIVE_INFINITY && remainingSlots > 0 && (
                    <span className='text-primary-main'> • {remainingSlots} slots remaining</span>
                  )}
                </p>
              )}
            </div>
            <input
              type='file'
              id={id}
              onChange={onFileChange}
              className='hidden'
              disabled={isFieldDisabled}
              multiple={limit > 1}
              accept='*/*'
            />
          </div>
        )}

        {/* Limit Reached State */}
        {!canUploadMore && !readOnly && (
          <div
            className={twMerge(
              // 'absolute top-0 left-0 right-0 bottom-0 -z-10 opacity-50 flex items-center justify-center',
              'flex flex-col items-center justify-center p-4 text-center text-text-secondary'
            )}
          >
            <IconAlertCircleTwotone className='w-10 h-10 mb-3 text-warning-main' />
            <p className='mb-2 text-sm font-semibold'>Maximum file limit reached</p>
            <p className='text-xs'>
              {limit} of {limit} files uploaded. Remove some files to upload more.
            </p>
          </div>
        )}

        {/* Read Only Empty State */}
        {readOnly && value.length === 0 && (
          <div
            className={twMerge(
              // 'absolute top-0 left-0 right-0 bottom-0 -z-10 opacity-50 flex items-center justify-center',
              'flex flex-col items-center justify-center p-4 text-center text-text-secondary'
            )}
          >
            <IconFile className='w-10 h-10 mb-3' />
            <p className='mb-2 text-sm font-semibold'>Tidak ada file yang di upload</p>
          </div>
        )}
      </label>

      {/* Footer Info */}
      <div className='flex justify-between items-center mt-2 px-1'>
        <Typography component='span' variant='caption' color='error'>
          {error}
        </Typography>
        {!(readOnly || isFieldDisabled) && (
          <Typography component='span' variant='caption' color={totalSize >= sizeLimit ? 'error' : 'text-secondary'}>
            {`Siap diupload ${convertBytesToMB(totalSize)}/${size}`}
          </Typography>
        )}
      </div>

      {/* Progress Bar for Size Limit */}
      {!(readOnly || isFieldDisabled) && totalSize > 0 && (
        <div className='mt-2'>
          <Progress value={(totalSize / sizeLimit) * 100} className='h-1' />
        </div>
      )}
    </div>
  )
}
