import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import {
  fetchRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe
} from '../../../store/slices/recipeSlice';
import { fetchRawMaterials } from '../../../store/slices/rawMaterialSlice';
import { fetchMeals } from '../../../store/slices/mealSlice';
import type { Recipe, RecipeItem } from '../../../services/recipe.service';
import type { RawMaterial } from '../../../services/rawMaterial.service';
import { MealType, MealCategory } from '../../../services/meal.service';
import type { Meal } from '../../../services/meal.service';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Upload, 
  Space, 
  Tag, 
  Tooltip,
  message,
  Divider,
  Typography
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { RcFile } from 'antd/es/upload';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Recipes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: recipes, loading: recipesLoading, error: recipesError } = useSelector((state: RootState) => state.recipes);
  const { items: rawMaterials, loading: materialsLoading } = useSelector((state: RootState) => state.rawMaterials);
  const { meals, loading: mealsLoading } = useSelector((state: RootState) => state.meal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    dispatch(fetchRecipes());
    dispatch(fetchRawMaterials());
    dispatch(fetchMeals());
  }, [dispatch]);

  const handleOpenModal = (recipe?: Recipe) => {
    if (recipe) {
      setCurrentRecipe(recipe);
      form.setFieldsValue({
        name: recipe.name,
        description: recipe.description,
        mealId: recipe.mealId,
        category: recipe.category
      });
      if (recipe.imageUrl) {
        setFileList([{
          uid: '-1',
          name: 'recipe-image.png',
          status: 'done',
          url: recipe.imageUrl,
        }]);
      }
    } else {
      setCurrentRecipe(null);
      form.resetFields();
      setFileList([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRecipe(null);
    form.resetFields();
    setFileList([]);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        imageUrl: fileList[0]?.url || fileList[0]?.response?.url,
        recipeItems: [], // Initialize empty recipe items array
        preparationTime: 0, // Default values for required fields
        cookingTime: 0,
        servings: 1,
        costPerServing: 0,
        instructions: values.description // Use description as instructions
      };
      
      if (currentRecipe) {
        await dispatch(updateRecipe({ id: currentRecipe.id, data: formData }));
        message.success('Recipe updated successfully');
      } else {
        await dispatch(addRecipe(formData));
        message.success('Recipe added successfully');
      }
      handleCloseModal();
    } catch (error) {
      message.error('Failed to save recipe');
      console.error('Failed to save recipe:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteRecipe(id));
      message.success('Recipe deleted successfully');
    } catch (error) {
      message.error('Failed to delete recipe');
      console.error('Failed to delete recipe:', error);
    }
  };

  // Ensure meals is an array
  const mealsList = Array.isArray(meals) ? meals : [];

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (imageUrl: string) => (
        <img 
          src={imageUrl || '/placeholder-recipe.png'} 
          alt="Recipe" 
          className="w-16 h-16 object-cover rounded-lg"
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: MealCategory) => (
        <Tag color={getMealCategoryColor(category)} className="text-sm font-medium">
          {category.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: MealType) => (
        <Tag color={getMealTypeColor(type)} className="text-sm font-medium">
          {type}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <div className="max-w-md">
          <Text ellipsis={{ tooltip: text }}>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Recipe) => (
        <Space>
          <Tooltip title="Edit Recipe">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
              className="flex items-center"
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Recipe">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              className="flex items-center"
            >
              Delete
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Helper function to get color based on meal type
  const getMealTypeColor = (type?: MealType) => {
    switch (type) {
      case MealType.BREAKFAST:
        return 'blue';
      case MealType.LUNCH:
        return 'green';
      case MealType.DINNER:
        return 'purple';
      default:
        return 'default';
    }
  };

  // Helper function to get color based on meal category
  const getMealCategoryColor = (category?: MealCategory) => {
    switch (category) {
      case MealCategory.VEGETARIAN:
        return 'green';
      case MealCategory.NON_VEGETARIAN:
        return 'red';
      case MealCategory.DESSERT:
        return 'pink';
      case MealCategory.SNACKS:
        return 'orange';
      default:
        return 'default';
    }
  };

  if (recipesLoading || materialsLoading || mealsLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (recipesError) {
    return <div className="text-red-500 text-center">{recipesError}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Recipe Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => handleOpenModal()}
        >
          Add Recipe
        </Button>
      </div>

      <Card className="shadow-lg">
        <Table
          columns={columns}
          dataSource={recipes}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} recipes`,
            className: "px-4"
          }}
          className="recipe-table"
          loading={recipesLoading}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        title={currentRecipe ? 'Edit Recipe' : 'Add Recipe'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            category: MealCategory.VEGETARIAN,
            type: MealType.BREAKFAST
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Recipe Name"
              rules={[{ required: true, message: 'Please enter recipe name' }]}
            >
              <Input placeholder="Enter recipe name" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select category">
                {Object.values(MealCategory).map((category) => (
                  <Option key={category} value={category}>
                    {category.replace('_', ' ')}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="type"
            label="Meal Type"
            rules={[{ required: true, message: 'Please select a meal type' }]}
          >
            <Select placeholder="Select meal type">
              {Object.values(MealType).map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Recipe Details"
            rules={[{ required: true, message: 'Please enter recipe details' }]}
            extra="Include ingredients, preparation time, cooking time, servings, and cooking instructions in the description."
          >
            <TextArea 
              rows={8} 
              placeholder="Enter recipe details including:
- Number of servings
- Preparation time
- Cooking time
- Ingredients list
- Step-by-step cooking instructions" 
            />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Recipe Image"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('You can only upload image files!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error('Image must be smaller than 2MB!');
                }
                return isImage && isLt2M;
              }}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {currentRecipe ? 'Update Recipe' : 'Add Recipe'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="recipe preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default Recipes; 